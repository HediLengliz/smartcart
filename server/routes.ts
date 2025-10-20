import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import "./types"; // Import session types
import { storage } from "./storage";
import { db } from "./db";
import Stripe from "stripe";
import OpenAI from "openai";
import { 
  createUser, 
  verifyUser, 
  initiatePasswordReset, 
  resetPassword,
  comparePassword,
  generateVerificationCode,
  getVerificationExpiry,
} from "./auth";
import { sendVerificationEmail, sendPasswordResetEmail, sendOrderConfirmationEmail } from "./email";
import { 
  insertListSchema, 
  insertListItemSchema,
  insertProductSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertPaymentSchema,
  insertMessageSchema,
  orderItems,
} from "@shared/schema";
import { z } from "zod";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

// Initialize OpenAI
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing required OpenAI secret: OPENAI_API_KEY");
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware to parse user from session
function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== AUTH ROUTES ====================
  
  // Register new user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const user = await createUser(name, email, password);

      // Send verification email with code
      await sendVerificationEmail(email, user.verificationCode!, name);
      console.log(`Verification code for ${email}: ${user.verificationCode}`);

      res.json({ 
        message: "User registered successfully. Please check your email for verification code.",
        userId: user.id,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // Verify email
  app.post("/api/auth/verify-email", async (req: Request, res: Response) => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({ error: "Email and code are required" });
      }

      const verified = await verifyUser(email, code);

      if (!verified) {
        return res.status(400).json({ error: "Invalid or expired verification code" });
      }

      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ error: "Failed to verify email" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (!user.emailVerified) {
        return res.status(403).json({ error: "Please verify your email before logging in" });
      }

      const validPassword = await comparePassword(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      
      const { password: _, verificationCode, resetCode, ...userWithoutSensitive } = user;
      res.json({ message: "Login successful", user: userWithoutSensitive });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Request password reset
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const initiated = await initiatePasswordReset(email);

      if (!initiated) {
        // Don't reveal if email exists
        return res.json({ message: "If the email exists, a reset code has been sent" });
      }

      const user = await storage.getUserByEmail(email);
      if (user && user.resetCode) {
        await sendPasswordResetEmail(email, user.resetCode, user.name);
        console.log(`Reset code for ${email}: ${user.resetCode}`);
      }

      res.json({ message: "If the email exists, a reset code has been sent" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ error: "Failed to initiate password reset" });
    }
  });

  // Reset password with code
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { email, code, newPassword } = req.body;

      if (!email || !code || !newPassword) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const reset = await resetPassword(email, code, newPassword);

      if (!reset) {
        return res.status(400).json({ error: "Invalid or expired reset code" });
      }

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, verificationCode, resetCode, ...userWithoutSensitive } = user;
      res.json(userWithoutSensitive);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Update user profile
  app.patch("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const { name, facebookLinked, facebookId } = req.body;
      
      const updates: any = {};
      if (name) updates.name = name;
      if (typeof facebookLinked === 'boolean') updates.facebookLinked = facebookLinked;
      if (facebookId !== undefined) updates.facebookId = facebookId;

      const user = await storage.updateUser(req.session.userId!, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, verificationCode, resetCode, ...userWithoutSensitive } = user;
      res.json(userWithoutSensitive);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // ==================== PRODUCT ROUTES ====================
  
  // Get all products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ error: "Failed to get products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ error: "Failed to get product" });
    }
  });

  // ==================== SHOPPING LIST ROUTES ====================
  
  // Get user's lists
  app.get("/api/lists", requireAuth, async (req: Request, res: Response) => {
    try {
      const lists = await storage.getUserLists(req.session.userId!);
      
      // Include items for each list
      const listsWithItems = await Promise.all(
        lists.map(async (list) => {
          const items = await storage.getListItems(list.id);
          return { ...list, items };
        })
      );
      
      res.json(listsWithItems);
    } catch (error) {
      console.error("Get lists error:", error);
      res.status(500).json({ error: "Failed to get lists" });
    }
  });

  // Create new list
  app.post("/api/lists", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertListSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      
      const list = await storage.createList(validated);
      res.json(list);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid list data", details: error.errors });
      }
      console.error("Create list error:", error);
      res.status(500).json({ error: "Failed to create list" });
    }
  });

  // Update list
  app.patch("/api/lists/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const list = await storage.getList(req.params.id);
      if (!list || list.userId !== req.session.userId) {
        return res.status(404).json({ error: "List not found" });
      }

      const updated = await storage.updateList(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Update list error:", error);
      res.status(500).json({ error: "Failed to update list" });
    }
  });

  // Delete list
  app.delete("/api/lists/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const list = await storage.getList(req.params.id);
      if (!list || list.userId !== req.session.userId) {
        return res.status(404).json({ error: "List not found" });
      }

      await storage.deleteList(req.params.id);
      res.json({ message: "List deleted successfully" });
    } catch (error) {
      console.error("Delete list error:", error);
      res.status(500).json({ error: "Failed to delete list" });
    }
  });

  // Add item to list
  app.post("/api/lists/:listId/items", requireAuth, async (req: Request, res: Response) => {
    try {
      const list = await storage.getList(req.params.listId);
      if (!list || list.userId !== req.session.userId) {
        return res.status(404).json({ error: "List not found" });
      }

      const validated = insertListItemSchema.parse({
        ...req.body,
        listId: req.params.listId,
      });

      const item = await storage.createListItem(validated);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid item data", details: error.errors });
      }
      console.error("Add item error:", error);
      res.status(500).json({ error: "Failed to add item" });
    }
  });

  // Update list item
  app.patch("/api/lists/items/:itemId", requireAuth, async (req: Request, res: Response) => {
    try {
      const item = await storage.updateListItem(req.params.itemId, req.body);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Update item error:", error);
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  // Delete list item
  app.delete("/api/lists/items/:itemId", requireAuth, async (req: Request, res: Response) => {
    try {
      await storage.deleteListItem(req.params.itemId);
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Delete item error:", error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  // ==================== ORDER ROUTES ====================
  
  // Get user's orders
  app.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
    try {
      const orders = await storage.getUserOrders(req.session.userId!);
      
      // Include items and payment for each order
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          const payment = await storage.getPayment(order.id);
          return { ...order, items, payment };
        })
      );
      
      res.json(ordersWithDetails);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  });

  // Get single order
  app.get("/api/orders/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order || order.userId !== req.session.userId) {
        return res.status(404).json({ error: "Order not found" });
      }

      const items = await storage.getOrderItems(order.id);
      const payment = await storage.getPayment(order.id);
      
      res.json({ ...order, items, payment });
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ error: "Failed to get order" });
    }
  });

  // Create new order (checkout)
  app.post("/api/orders", requireAuth, async (req: Request, res: Response) => {
    try {
      const { items } = req.body; // Array of {productId, quantity}

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Order must contain items" });
      }

      // Create order
      const order = await storage.createOrder({
        userId: req.session.userId!,
        status: "pending",
      });

      // Create order items and calculate total
      let total = 0;
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(400).json({ error: `Product ${item.productId} not found` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
        }

        await storage.createOrderItem({
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          quantity: item.quantity.toString(),
        });

        total += parseFloat(product.price) * item.quantity;
      }

      // Create payment record
      const payment = await storage.createPayment({
        orderId: order.id,
        amount: total.toFixed(2),
        status: "pending",
      });

      const orderItems = await storage.getOrderItems(order.id);
      res.json({ ...order, items: orderItems, payment, total });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // ==================== PAYMENT ROUTES ====================
  
  // Create Stripe Payment Intent
  app.post("/api/create-payment-intent", requireAuth, async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;

      const order = await storage.getOrder(orderId);
      if (!order || order.userId !== req.session.userId) {
        return res.status(404).json({ error: "Order not found" });
      }

      const payment = await storage.getPayment(orderId);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(payment.amount) * 100), // Convert to cents
        currency: "usd",
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      });

      // Update payment with Stripe payment intent ID
      await storage.updatePayment(payment.id, {
        stripePaymentIntentId: paymentIntent.id,
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Create payment intent error:", error);
      res.status(500).json({ error: "Failed to create payment intent: " + error.message });
    }
  });

  // Confirm payment and complete order
  app.post("/api/payments/confirm", requireAuth, async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;

      const order = await storage.getOrder(orderId);
      if (!order || order.userId !== req.session.userId) {
        return res.status(404).json({ error: "Order not found" });
      }

      const payment = await storage.getPayment(orderId);
      if (!payment || !payment.stripePaymentIntentId) {
        return res.status(404).json({ error: "Payment not found" });
      }

      // Retrieve payment intent from Stripe to verify status
      const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);

      if (paymentIntent.status === "succeeded") {
        // Update payment status
        await storage.updatePayment(payment.id, {
          status: "completed",
        });

        // Update order status
        await storage.updateOrder(orderId, { status: "completed" });

        // Update product stock
        const orderItems = await storage.getOrderItems(orderId);
        for (const item of orderItems) {
          const product = await storage.getProduct(item.productId);
          if (product) {
            await storage.updateProduct(product.id, {
              stock: product.stock - parseInt(item.quantity),
            });
          }
        }

        // Send order confirmation email
        const user = await storage.getUser(order.userId);
        if (user) {
          const total = parseFloat(payment.amount);
          await sendOrderConfirmationEmail(
            user.email,
            user.name,
            order.orderNumber,
            orderItems,
            total,
            "completed"
          );
        }

        res.json({ 
          message: "Payment successful", 
          order: { ...order, status: "completed" }, 
          payment: { ...payment, status: "completed" }
        });
      } else {
        await storage.updatePayment(payment.id, { status: "failed" });
        await storage.updateOrder(orderId, { status: "failed" });
        res.status(400).json({ error: "Payment was not successful" });
      }
    } catch (error: any) {
      console.error("Confirm payment error:", error);
      res.status(500).json({ error: "Failed to confirm payment: " + error.message });
    }
  });

  // ==================== FAQ ROUTES ====================
  
  app.get("/api/faqs", async (req: Request, res: Response) => {
    try {
      const faqs = await storage.getAllFAQs();
      res.json(faqs);
    } catch (error) {
      console.error("Get FAQs error:", error);
      res.status(500).json({ error: "Failed to get FAQs" });
    }
  });

  // ==================== MESSAGE ROUTES ====================
  
  app.get("/api/messages", requireAuth, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getUserMessages(req.session.userId!);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.post("/api/messages", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = insertMessageSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });

      const message = await storage.createMessage(validated);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid message data", details: error.errors });
      }
      console.error("Create message error:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  // ==================== TRENDING & RECOMMENDATIONS ====================
  
  // Get trending products (based on order frequency)
  app.get("/api/products/trending", async (req: Request, res: Response) => {
    try {
      const products = await storage.getAllProducts();
      const allOrderItems = await db.select().from(orderItems);
      
      // Count frequency of each product in orders
      const productFrequency = new Map<string, number>();
      for (const item of allOrderItems) {
        const count = productFrequency.get(item.productId) || 0;
        productFrequency.set(item.productId, count + 1);
      }

      // Sort products by frequency
      const trending = products
        .map(product => ({
          ...product,
          orderCount: productFrequency.get(product.id) || 0,
        }))
        .sort((a, b) => b.orderCount - a.orderCount)
        .slice(0, 4);

      res.json(trending);
    } catch (error) {
      console.error("Get trending products error:", error);
      res.status(500).json({ error: "Failed to get trending products" });
    }
  });

  // Get AI-powered product recommendations
  app.get("/api/products/recommended", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId!;
      
      // Get user's order history
      const orders = await storage.getUserOrders(userId);
      const allProducts = await storage.getAllProducts();
      
      if (orders.length === 0) {
        // No order history, return popular products
        const trending = allProducts.slice(0, 4);
        return res.json(trending);
      }

      // Get all order items for user's orders
      const userOrderItems = [];
      for (const order of orders) {
        const items = await storage.getOrderItems(order.id);
        userOrderItems.push(...items);
      }

      // Build purchase history for AI
      const purchaseHistory = userOrderItems.map(item => item.productName).join(", ");
      const availableProducts = allProducts.map(p => p.name).join(", ");

      // Use OpenAI to generate recommendations
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are a smart shopping assistant. Based on a user's purchase history, recommend 4 products they might like from the available products list. Return only product names as a JSON array.`,
          },
          {
            role: "user",
            content: `Purchase History: ${purchaseHistory}\n\nAvailable Products: ${availableProducts}\n\nRecommend 4 products as JSON array of product names.`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content || "{}");
      const recommendedNames = aiResponse.recommendations || [];

      // Match recommended names to actual products
      const recommended = allProducts
        .filter(p => recommendedNames.includes(p.name))
        .slice(0, 4);

      // If AI didn't return enough, fill with popular products
      if (recommended.length < 4) {
        const remaining = allProducts
          .filter(p => !recommendedNames.includes(p.name))
          .slice(0, 4 - recommended.length);
        recommended.push(...remaining);
      }

      res.json(recommended);
    } catch (error) {
      console.error("Get recommended products error:", error);
      // Fallback to random products on error
      const products = await storage.getAllProducts();
      res.json(products.slice(0, 4));
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
