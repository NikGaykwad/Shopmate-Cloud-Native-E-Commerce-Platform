import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongo:27017/shopmate_products";

const products = [
  // 📱 Mobiles
  {
    name: "Apple iPhone 15 Pro",
    description: "The ultimate iPhone with Titanium design.",
    price: 134900,
    category: "mobiles",
    stock: 25,
    images: ["/images/mobiles/iphone-15-pro.jpg"],
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Galaxy AI is here.",
    price: 129999,
    category: "mobiles",
    stock: 30,
    images: ["/images/mobiles/samsung-galaxy-s24-ultra.jpg"],
  },
  {
    name: "Google Pixel 8 Pro",
    description: "The AI-first phone from Google.",
    price: 106999,
    category: "mobiles",
    stock: 40,
    images: ["/images/mobiles/google-pixel-8-pro.jpg"],
  },
  {
    name: "OnePlus 12",
    description: "Smooth Beyond Belief.",
    price: 64999,
    category: "mobiles",
    stock: 50,
    images: ["/images/mobiles/oneplus-12.jpg"],
  },
  {
    name: "Xiaomi 14 Ultra",
    description: "Leica Summilux Lens.",
    price: 99999,
    category: "mobiles",
    stock: 20,
    images: ["/images/mobiles/xiaomi-14-ultra.jpg"],
  },
  {
    name: "iQOO Neo 9 Pro",
    description: "Supercharged Performance.",
    price: 35999,
    category: "mobiles",
    stock: 35,
    images: ["/images/mobiles/iqoo-neo-9-pro.jpg"],
  },
  {
    name: "Motorola Edge 50 Pro",
    description: "Premium Design, Powerful Performance.",
    price: 31999,
    category: "mobiles",
    stock: 40,
    images: ["/images/mobiles/motorola-edge-50-pro.jpg"],
  },
  {
    name: "Nothing Phone 2a",
    description: "Glyph Interface Redefined.",
    price: 23999,
    category: "mobiles",
    stock: 45,
    images: ["/images/mobiles/nothing-phone-2a.jpg"],
  },
  {
    name: "Realme 12 Pro Plus 5G",
    description: "Periscope Telephoto Camera.",
    price: 29999,
    category: "mobiles",
    stock: 50,
    images: ["/images/mobiles/realme-12-pro-plus-5g.jpg"],
  },
  {
    name: "Vivo V30 Pro",
    description: "Aura Light Portrait Master.",
    price: 41999,
    category: "mobiles",
    stock: 30,
    images: ["/images/mobiles/vivo-v30-pro.jpg"],
  },

  // 🎧 Electronics
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancellation.",
    price: 26990,
    category: "electronics",
    stock: 45,
    images: ["/images/electronics/sony-wh-1000xm5-noise-cancelling-headphones.jpg"],
  },
  {
    name: "Apple iPad Air (5th Gen)",
    description: "Supercharged by Apple M1 chip.",
    price: 54900,
    category: "electronics",
    stock: 25,
    images: ["/images/electronics/apple-ipad-air-5th-gen-64gb.jpg"],
  },
  {
    name: "Logitech MX Master 3S",
    description: "Performance Wireless Mouse.",
    price: 9995,
    category: "electronics",
    stock: 60,
    images: ["/images/electronics/logitech-mx-master-3s-mouse.jpg"],
  },
  {
    name: "Keychron K2 Pro",
    description: "QMK/VIA Wireless Mechanical Keyboard.",
    price: 11999,
    category: "electronics",
    stock: 30,
    images: ["/images/electronics/keychron-k2-pro-mechanical-keyboard.jpg"],
  },
  {
    name: "GoPro Hero12 Black",
    description: "Incredible Image Quality.",
    price: 39990,
    category: "electronics",
    stock: 15,
    images: ["/images/electronics/gopro-hero12-black.jpg"],
  },
  {
    name: "ASUS TUF Gaming Laptop",
    description: "High-performance gaming laptop.",
    price: 89990,
    category: "electronics",
    stock: 15,
    images: ["/images/electronics/asus-tuf.jpg"],
  },
  {
    name: "MacBook Air M2",
    description: "Supercharged by M2 chip.",
    price: 114900,
    category: "electronics",
    stock: 20,
    images: ["/images/electronics/macbook-air.jpg"],
  },
  {
    name: "JBL Flip 6 Bluetooth Speaker",
    description: "Powerful portable sound.",
    price: 11999,
    category: "electronics",
    stock: 50,
    images: ["/images/electronics/jbl-flip-6-bluetooth-speaker.jpg"],
  },
  {
    name: "Mi Power Bank 3i 20000mAh",
    description: "Fast charging power bank.",
    price: 1999,
    category: "electronics",
    stock: 100,
    images: ["/images/electronics/mi-power-bank-3i-20000mah.jpg"],
  },
  {
    name: "Philips Steam Iron GC1905",
    description: "Non-stick soleplate iron.",
    price: 1295,
    category: "electronics",
    stock: 60,
    images: ["/images/electronics/philips-steam-iron-gc1905.jpg"],
  },

  // 📺 TV & Appliances
  {
    name: "Sony Bravia 55' 4K Google TV",
    description: "Triluminos Pro display.",
    price: 74990,
    category: "tv-appliances",
    stock: 10,
    images: ["/images/tv-appliances/sony-bravia-55-inch-4k-smart-led-google-tv.jpg"],
  },
  {
    name: "Samsung 8kg Front Load Washing Machine",
    description: "5 Star AI Control.",
    price: 35990,
    category: "tv-appliances",
    stock: 15,
    images: ["/images/tv-appliances/samsung-8kg-5-star-front-load-washing-machine.jpg"],
  },
  {
    name: "Dyson V15 Detect Vacuum",
    description: "Laser detects microscopic dust.",
    price: 65900,
    category: "tv-appliances",
    stock: 20,
    images: ["/images/tv-appliances/dyson-v15-detect-cordless-vacuum-cleaner.jpg"],
  },
  {
    name: "Bosch Dishwasher",
    description: "13 Place Settings.",
    price: 45990,
    category: "tv-appliances",
    stock: 20,
    images: ["/images/tv-appliances/bosch-13-place-settings-dishwasher.jpg"],
  },
  {
    name: "Whirlpool 20L Microwave",
    description: "Solo Microwave Oven.",
    price: 6490,
    category: "tv-appliances",
    stock: 40,
    images: ["/images/tv-appliances/whirlpool-20l-solo-microwave-oven.jpg"],
  },
  {
    name: "LG 324L Frost Free Refrigerator",
    description: "3 Star Double Door Fridge.",
    price: 32990,
    category: "tv-appliances",
    stock: 12,
    images: ["/images/tv-appliances/lg-324l-3-star-frost-free-double-door-refrigerator.jpg"],
  },
  {
    name: "Daikin 1.5 Ton Inverter AC",
    description: "5 Star Split AC.",
    price: 42990,
    category: "tv-appliances",
    stock: 10,
    images: ["/images/tv-appliances/daikin-1-5-ton-5-star-inverter-split-ac.jpg"],
  },
  {
    name: "Kent Supreme RO Water Purifier",
    description: "Alkaline RO+UV+UF.",
    price: 18999,
    category: "tv-appliances",
    stock: 25,
    images: ["/images/tv-appliances/kent-supreme-alkaline-ro-uv-uf-water-purifier.jpg"],
  },
  {
    name: "Philips 750W Mixer Grinder",
    description: "3 Jars with powerful motor.",
    price: 4499,
    category: "tv-appliances",
    stock: 40,
    images: ["/images/tv-appliances/philips-750w-mixer-grinder.jpg"],
  },
  {
    name: "Bajaj New Shakti Water Heater",
    description: "15L Storage Water Heater.",
    price: 7990,
    category: "tv-appliances",
    stock: 30,
    images: ["/images/tv-appliances/bajaj-new-shakti-neo-15l-water-heater.jpg"],
  },

  // 👕 Fashion
  {
    name: "Adidas Originals T-Shirt",
    description: "Classic Trefoil Tee.",
    price: 2299,
    category: "fashion",
    stock: 100,
    images: ["/images/fashion/adidas-originals-mens-tshirt.jpg"],
  },
  {
    name: "Nike Air Jordan 1 Retro",
    description: "High-top sneakers.",
    price: 16995,
    category: "fashion",
    stock: 20,
    images: ["/images/fashion/nike-air-jordan-1-retro-high.jpg"],
  },
  {
    name: "Levi's 511 Slim Fit Jeans",
    description: "Stretch denim.",
    price: 2699,
    category: "fashion",
    stock: 80,
    images: ["/images/fashion/levis-mens-511-slim-fit-jeans.jpg"],
  },
  {
    name: "Zara Floral Print Dress",
    description: "Woven midi dress.",
    price: 3990,
    category: "fashion",
    stock: 50,
    images: ["/images/fashion/zara-floral-print-woven-dress.jpg"],
  },
  {
    name: "Fossil Gen 6 Smartwatch",
    description: "Wear OS by Google.",
    price: 23995,
    category: "fashion",
    stock: 30,
    images: ["/images/fashion/fossil-gen-6-smartwatch.jpg"],
  },

  // 🏠 Home & Kitchen
  {
    name: "Corelle Dinner Set",
    description: "21-piece set, lightweight.",
    price: 8499,
    category: "home-kitchen",
    stock: 20,
    images: ["/images/home-kitchen/corelle-dinner-set-21-pieces.jpg"],
  },
  {
    name: "NutriBullet Pro Blender",
    description: "900W High Speed Blender.",
    price: 8990,
    category: "home-kitchen",
    stock: 40,
    images: ["/images/home-kitchen/nutribullet-pro-high-speed-blender.jpg"],
  },
  {
    name: "Wonderchef Granite Wok",
    description: "Non-stick with lid.",
    price: 2499,
    category: "home-kitchen",
    stock: 50,
    images: ["/images/home-kitchen/wonderchef-granite-wok-with-lid.jpg"],
  },
  {
    name: "Milton Thermosteel Bottle",
    description: "1L Vacuum Insulated.",
    price: 999,
    category: "home-kitchen",
    stock: 100,
    images: ["/images/home-kitchen/milton-thermosteel-water-bottle-1l.jpg"],
  },
  {
    name: "Prestige Svachh Pressure Cooker",
    description: "3L Inner Lid Cooker.",
    price: 2199,
    category: "home-kitchen",
    stock: 50,
    images: ["/images/home-kitchen/prestige-svachh-pressure-cooker-3l.jpg"],
  },

  // 💄 Beauty
  {
    name: "Beardo Godfather Beard Oil",
    description: "For a softer beard.",
    price: 350,
    category: "beauty",
    stock: 100,
    images: ["/images/beauty/beardo-godfather-beard-oil.jpg"],
  },
  {
    name: "Maybelline Fit Me Foundation",
    description: "Matte + Poreless.",
    price: 549,
    category: "beauty",
    stock: 150,
    images: ["/images/beauty/maybelline-fit-me-foundation.jpg"],
  },
  {
    name: "Clinique Moisture Surge",
    description: "100H Auto-Replenishing Hydrator.",
    price: 2950,
    category: "beauty",
    stock: 60,
    images: ["/images/beauty/clinique-moisture-surrogate-100h-hydrator.jpg"],
  },
  {
    name: "Lakme Absolute Matte Melt",
    description: "Liquid Lip Color.",
    price: 800,
    category: "beauty",
    stock: 80,
    images: ["/images/beauty/lakme-absolute-matte-melt-liquid-lip-color.jpg"],
  },
  {
    name: "L'Oreal Paris Hyaluron Moisture Shampoo",
    description: "72H Hydration Shampoo.",
    price: 399,
    category: "beauty",
    stock: 120,
    images: ["/images/beauty/loreal-paris-hyaluron-moisture-shampoo.jpg"],
  },

  // 🎮 Toys
  {
    name: "Lego Technic Ferrari",
    description: "Daytona SP3 Model.",
    price: 39999,
    category: "toys",
    stock: 10,
    images: ["/images/toys/lego-technic-ferrari-daytona-sp3.jpg"],
  },
  {
    name: "Barbie Dreamhouse",
    description: "Dollhouse with Pool & Slide.",
    price: 19999,
    category: "toys",
    stock: 15,
    images: ["/images/toys/barbie-dreamhouse-dollhouse.jpg"],
  },
  {
    name: "Hot Wheels 10 Car Pack",
    description: "1:64 scale vehicles.",
    price: 1499,
    category: "toys",
    stock: 50,
    images: ["/images/toys/hot-wheels-10-car-pack-set.jpg"],
  },
  {
    name: "Monopoly Classic",
    description: "Fast-dealing property trading game.",
    price: 999,
    category: "toys",
    stock: 60,
    images: ["/images/toys/monopoly-classic-board-game.jpg"],
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