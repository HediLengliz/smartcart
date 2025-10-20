import { db } from "./db";
import { 
  users, products, lists, listItems, orders, orderItems, payments, messages, faqs,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type List, type InsertList,
  type ListItem, type InsertListItem,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Payment, type InsertPayment,
  type Message, type InsertMessage,
  type FAQ, type InsertFAQ,
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, data: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // List operations
  getUserLists(userId: string): Promise<List[]>;
  getList(id: string): Promise<List | undefined>;
  createList(list: InsertList): Promise<List>;
  updateList(id: string, data: Partial<List>): Promise<List | undefined>;
  deleteList(id: string): Promise<boolean>;
  
  // ListItem operations
  getListItems(listId: string): Promise<ListItem[]>;
  createListItem(item: InsertListItem): Promise<ListItem>;
  updateListItem(id: string, data: Partial<ListItem>): Promise<ListItem | undefined>;
  deleteListItem(id: string): Promise<boolean>;
  
  // Order operations
  getUserOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, data: Partial<Order>): Promise<Order | undefined>;
  
  // OrderItem operations
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Payment operations
  getPayment(orderId: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined>;
  
  // Message operations
  getUserMessages(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // FAQ operations
  getAllFAQs(): Promise<FAQ[]>;
  createFAQ(faq: InsertFAQ): Promise<FAQ>;
}

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // List operations
  async getUserLists(userId: string): Promise<List[]> {
    return await db.select().from(lists).where(eq(lists.userId, userId)).orderBy(desc(lists.createdAt));
  }

  async getList(id: string): Promise<List | undefined> {
    const [list] = await db.select().from(lists).where(eq(lists.id, id));
    return list;
  }

  async createList(list: InsertList): Promise<List> {
    const [newList] = await db.insert(lists).values(list).returning();
    return newList;
  }

  async updateList(id: string, data: Partial<List>): Promise<List | undefined> {
    const [list] = await db.update(lists).set(data).where(eq(lists.id, id)).returning();
    return list;
  }

  async deleteList(id: string): Promise<boolean> {
    const result = await db.delete(lists).where(eq(lists.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // ListItem operations
  async getListItems(listId: string): Promise<ListItem[]> {
    return await db.select().from(listItems).where(eq(listItems.listId, listId));
  }

  async createListItem(item: InsertListItem): Promise<ListItem> {
    const [newItem] = await db.insert(listItems).values(item).returning();
    return newItem;
  }

  async updateListItem(id: string, data: Partial<ListItem>): Promise<ListItem | undefined> {
    const [item] = await db.update(listItems).set(data).where(eq(listItems.id, id)).returning();
    return item;
  }

  async deleteListItem(id: string): Promise<boolean> {
    const result = await db.delete(listItems).where(eq(listItems.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Order operations
  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const [newOrder] = await db.insert(orders).values({ ...order, orderNumber }).returning();
    return newOrder;
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order | undefined> {
    const [order] = await db.update(orders).set(data).where(eq(orders.id, id)).returning();
    return order;
  }

  // OrderItem operations
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }

  // Payment operations
  async getPayment(orderId: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.orderId, orderId));
    return payment;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined> {
    const [payment] = await db.update(payments).set(data).where(eq(payments.id, id)).returning();
    return payment;
  }

  // Message operations
  async getUserMessages(userId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.userId, userId)).orderBy(desc(messages.timestamp));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  // FAQ operations
  async getAllFAQs(): Promise<FAQ[]> {
    return await db.select().from(faqs);
  }

  async createFAQ(faq: InsertFAQ): Promise<FAQ> {
    const [newFAQ] = await db.insert(faqs).values(faq).returning();
    return newFAQ;
  }
}

export const storage = new DbStorage();
