import { db } from "./db";
import { products, faqs } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Check if products already exist
  const existingProducts = await db.select().from(products);
  
  if (existingProducts.length === 0) {
    console.log("Adding products...");
    await db.insert(products).values([
      {
        name: "Organic Red Apples",
        price: "4.99",
        stock: 25,
        image: "/assets/generated_images/Product_image_red_apples_284e8d69.png",
        description: "Fresh organic red apples, perfect for snacking or baking",
      },
      {
        name: "Artisan Bread",
        price: "5.49",
        stock: 12,
        image: "/assets/generated_images/Product_image_artisan_bread_95f14847.png",
        description: "Freshly baked whole grain artisan bread with a golden crust",
      },
      {
        name: "Fresh Milk",
        price: "3.99",
        stock: 30,
        image: "/assets/generated_images/Product_image_milk_bottle_35e9e2b1.png",
        description: "Fresh organic milk in glass bottle, 1 liter",
      },
      {
        name: "Ripe Bananas",
        price: "2.99",
        stock: 18,
        image: "/assets/generated_images/Product_image_yellow_bananas_43a8e66f.png",
        description: "Perfectly ripe bananas, great source of potassium",
      },
      {
        name: "Premium Coffee Beans",
        price: "12.99",
        stock: 8,
        image: "/assets/generated_images/Product_image_coffee_beans_d0bb6ddc.png",
        description: "Rich premium coffee beans for the perfect morning brew",
      },
      {
        name: "Fresh Orange Juice",
        price: "5.99",
        stock: 15,
        image: "/assets/generated_images/Product_image_orange_juice_9d3b486d.png",
        description: "Freshly squeezed orange juice, 100% natural",
      },
    ]);
    console.log("✅ Products added");
  } else {
    console.log("⏭️  Products already exist, skipping");
  }

  // Check if FAQs already exist
  const existingFAQs = await db.select().from(faqs);
  
  if (existingFAQs.length === 0) {
    console.log("Adding FAQs...");
    await db.insert(faqs).values([
      {
        question: "How do I create a shopping list?",
        answer: "Click on the 'Shopping Lists' section and then click 'Create New List'. You can add items manually or from your product browsing experience. Each item can have a specific quantity and unit.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe payment gateway. Your payment information is encrypted and we never store your full card details.",
      },
      {
        question: "How does AI recommendation work?",
        answer: "Our AI analyzes your previous orders and shopping patterns to suggest products you might be interested in. The more you shop, the better the recommendations become, helping you discover new items and save time.",
      },
      {
        question: "Can I share my shopping lists?",
        answer: "Yes! You can link your Facebook account in your dashboard and share your shopping lists with friends and family. This is perfect for collaborative shopping or planning events together.",
      },
      {
        question: "How do I track my orders?",
        answer: "Visit the Orders section to see all your order history. Each order shows its current status (pending, completed, or failed) along with order details and payment information. You'll also receive email confirmations with receipts.",
      },
      {
        question: "What are trending products?",
        answer: "Trending products are items that are popular among our customers based on recent order frequency and popularity metrics. This section is updated regularly to show you what's hot right now.",
      },
    ]);
    console.log("✅ FAQs added");
  } else {
    console.log("⏭️  FAQs already exist, skipping");
  }

  console.log("✅ Database seeding complete!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
