import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongo:27017/shopmate_products";

const products = [
  // 🔌 Electronics
  {
    name: "Apple iPad Air (5th Gen) - 64GB",
    description: "Supercharged by Apple M1 chip.",
    price: 54900,
    category: "electronics",
    stock: 25,
    images: ["/images/electronics/apple-ipad-air-5th-gen-64gb.jpg"],
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancellation.",
    price: 26990,
    category: "electronics",
    stock: 45,
    images: ["/images/electronics/sony-wh-1000xm5-noise-cancelling-headphones.jpg"],
  },
  {
    name: "Logitech MX Master 3S Mouse",
    description: "8K DPI Any-Surface Tracking mouse.",
    price: 9995,
    category: "electronics",
    stock: 70,
    images: ["/images/electronics/logitech-mx-master-3s-mouse.jpg"],
  },
  {
    name: "Keychron K2 Pro Keyboard",
    description: "Wireless mechanical keyboard.",
    price: 11999,
    category: "electronics",
    stock: 30,
    images: ["/images/electronics/keychron-k2-pro-mechanical-keyboard.jpg"],
  },
  {
    name: "Philips Steam Iron",
    description: "1440W powerful steam iron.",
    price: 1599,
    category: "electronics",
    stock: 80,
    images: ["/images/electronics/philips-steam-iron-gc1905.jpg"],
  },

  // 👕 Fashion
  {
    name: "Adidas Originals Men's T-Shirt",
    description: "Classic cotton tee.",
    price: 2299,
    category: "fashion",
    stock: 150,
    images: ["/images/fashion/adidas-originals-mens-tshirt.jpg"],
  },
  {
    name: "Levi's 511 Slim Fit Jeans",
    description: "Modern slim-fit jeans.",
    price: 2699,
    category: "fashion",
    stock: 100,
    images: ["/images/fashion/levis-mens-511-slim-fit-jeans.jpg"],
  },
  {
    name: "Nike Air Jordan 1 Retro High",
    description: "Iconic sneaker.",
    price: 16995,
    category: "fashion",
    stock: 20,
    images: ["/images/fashion/nike-air-jordan-1-retro-high.jpg"],
  },

  // 🏠 Home & Kitchen
  {
    name: "Corelle Dinner Set",
    description: "21-piece dinner set.",
    price: 8499,
    category: "home-kitchen",
    stock: 20,
    images: ["/images/home-kitchen/corelle-dinner-set-21-pieces.jpg"],
  },
  {
    name: "NutriBullet Pro Blender",
    description: "High-speed nutrient extractor.",
    price: 8990,
    category: "home-kitchen",
    stock: 40,
    images: ["/images/home-kitchen/nutribullet-pro-high-speed-blender.jpg"],
  },

  // 💄 Beauty
  {
    name: "Beardo Godfather Beard Oil",
    description: "Promotes beard growth.",
    price: 350,
    category: "beauty",
    stock: 100,
    images: ["/images/beauty/beardo-godfather-beard-oil.jpg"],
  },
  {
    name: "Maybelline Fit Me Foundation",
    description: "Matte + Poreless foundation.",
    price: 549,
    category: "beauty",
    stock: 150,
    images: ["/images/beauty/maybelline-fit-me-foundation.jpg"],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("📦 Connected to MongoDB");

    await Product.deleteMany({});
    console.log("🗑 Old products removed");

    await Product.insertMany(products);
    console.log("✅ Products seeded successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
