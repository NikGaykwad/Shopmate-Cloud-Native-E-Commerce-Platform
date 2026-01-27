import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/shopmate_products';

const products = [
    // 📱 Mobiles (10)
    {
        name: "Apple iPhone 15 Pro (128GB) - Natural Titanium",
        description: "iPhone 15 Pro features a strong and light aerospace-grade titanium design with a textured matte-glass back.",
        price: 134900,
        category: "mobiles",
        stock: 50,
        images: ["/images/mobiles/iphone-15-pro.jpg"]
    },
    {
        name: "Samsung Galaxy S24 Ultra (AI Phone)",
        description: "Meet Galaxy S24 Ultra, the ultimate Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display.",
        price: 129999,
        category: "mobiles",
        stock: 45,
        images: ["/images/mobiles/samsung-galaxy-s24-ultra.jpg"]
    },
    {
        name: "OnePlus 12 (Flowy Emerald, 16GB RAM)",
        description: "The OnePlus 12 redefines the meaning of smooth, with a Snapdragon 8 Gen 3 Mobile Platform and 4th Gen Hasselblad Camera.",
        price: 69999,
        category: "mobiles",
        stock: 100,
        images: ["/images/mobiles/oneplus-12.jpg"]
    },
    {
        name: "Google Pixel 8 Pro",
        description: "The AI-powered phone by Google. It has the best Pixel camera yet and a battery that lasts all day.",
        price: 106999,
        category: "mobiles",
        stock: 30,
        images: ["/images/mobiles/google-pixel-8-pro.jpg"]
    },
    {
        name: "Xiaomi 14 Ultra",
        description: "Leica Summilux optical lens, Snapdragon 8 Gen 3, and a stunning WQHD+ AMOLED display.",
        price: 99999,
        category: "mobiles",
        stock: 20,
        images: ["/images/mobiles/xiaomi-14-ultra.jpg"]
    },
    {
        name: "Nothing Phone (2a)",
        description: "Unique Glyph Interface, custom Nothing OS 2.5, and powerful MediaTek Dimensity 7200 Pro chipset.",
        price: 23999,
        category: "mobiles",
        stock: 200,
        images: ["/images/mobiles/nothing-phone-2a.jpg"]
    },
    {
        name: "Realme 12 Pro+ 5G",
        description: "Periscope Portrait Camera, Luxury Watch Design, and 120Hz Curved Vision Display.",
        price: 29999,
        category: "mobiles",
        stock: 150,
        images: ["/images/mobiles/realme-12-pro-plus-5g.jpg"]
    },
    {
        name: "Motorola Edge 50 Pro",
        description: "World's 1st AI Powered Pro-Grade Camera and Pantone Validated True Color Display.",
        price: 31999,
        category: "mobiles",
        stock: 80,
        images: ["/images/mobiles/motorola-edge-50-pro.jpg"]
    },
    {
        name: "Vivo V30 Pro",
        description: "ZEISS Professional Portrait Camera and Aura Light Portrait for studio-quality photos.",
        price: 41999,
        category: "mobiles",
        stock: 60,
        images: ["/images/mobiles/vivo-v30-pro.jpg"]
    },
    {
        name: "iQOO Neo 9 Pro",
        description: "Dual Chip Power, Snapdragon 8 Gen 2, and Supercomputing Chip Q1 for ultimate gaming.",
        price: 36999,
        category: "mobiles",
        stock: 90,
        images: ["/images/mobiles/iqoo-neo-9-pro.jpg"]
    },


    // 📺 TV & Appliances (10)
    {
        name: "Sony Bravia 55 inch 4K Ultra HD Smart LED Google TV",
        description: "X1 4K HDR Processor, 4K X-Reality PRO, and Dolby Audio for an immersive experience.",
        price: 57990,
        category: "tv-appliances",
        stock: 25,
        images: ["/images/tv-appliances/sony-bravia-55-inch-4k-smart-led-google-tv.jpg"]
    },
    {
        name: "LG 324 L 3 Star Frost-Free Double Door Refrigerator",
        description: "Smart Inverter Compressor, Multi Air Flow, and Convertible functionality.",
        price: 35990,
        category: "tv-appliances",
        stock: 15,
        images: ["/images/tv-appliances/lg-324l-3-star-frost-free-double-door-refrigerator.jpg"]
    },
    {
        name: "Samsung 8 kg 5 Star Fully-Automatic Front Loading Washing Machine",
        description: "Eco Bubble Technology, Hygiene Steam, and Digital Inverter Motor.",
        price: 36990,
        category: "tv-appliances",
        stock: 20,
        images: ["/images/tv-appliances/samsung-8kg-5-star-front-load-washing-machine.jpg"]
    },
    {
        name: "Whirlpool 20 L Solo Microwave Oven",
        description: "Feather Touch Control panel, 5 Power Levels, and a large glass turntable.",
        price: 5990,
        category: "tv-appliances",
        stock: 40,
        images: ["/images/tv-appliances/whirlpool-20l-solo-microwave-oven.jpg"]
    },
    {
        name: "Daikin 1.5 Ton 5 Star Inverter Split AC",
        description: "Dew Clean Technology, PM 2.5 Filter, and 3D Airflow for superior cooling.",
        price: 45490,
        category: "tv-appliances",
        stock: 30,
        images: ["/images/tv-appliances/daikin-1-5-ton-5-star-inverter-split-ac.jpg"]
    },
    {
        name: "Kent Supreme Alkaline RO+UV+UF Water Purifier",
        description: "Zero Water Wastage Technology, Alkaline feature to maintain pH level.",
        price: 16499,
        category: "tv-appliances",
        stock: 50,
        images: ["/images/tv-appliances/kent-supreme-alkaline-ro-uv-uf-water-purifier.jpg"]
    },
    {
        name: "Philips 750 W Mixer Grinder (HL7756/00)",
        description: "Powerful 750W Turbo Motor, continuous grinding of tough ingredients.",
        price: 3499,
        category: "tv-appliances",
        stock: 100,
        images: ["/images/tv-appliances/philips-750w-mixer-grinder.jpg"]
    },
    {
        name: "Bosch 13 Place Settings Dishwasher",
        description: "Intensive Kadhai Programme, HygienePlus option, and Glass protection technology.",
        price: 43990,
        category: "tv-appliances",
        stock: 10,
        images: ["/images/tv-appliances/bosch-13-place-settings-dishwasher.jpg"]
    },
    {
        name: "Dyson V15 Detect Cord-Free Vacuum Cleaner",
        description: "Laser reveals microscopic dust. Powerful suction for deep cleaning.",
        price: 65900,
        category: "tv-appliances",
        stock: 12,
        images: ["/images/tv-appliances/dyson-v15-detect-cordless-vacuum-cleaner.jpg"]
    },
    {
        name: "Bajaj New Shakti Neo 15L Water Heater",
        description: "Titanium Armour Technology, Swirl Flow Technology, and 4-star BEE rating.",
        price: 5499,
        category: "tv-appliances",
        stock: 60,
        images: ["/images/tv-appliances/bajaj-new-shakti-neo-15l-water-heater.jpg"]
    },

    // 🔌 Electronics (10)
    {
        name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        description: "Industry-leading noise cancellation, 30-hour battery life, and crystal clear calls.",
        price: 26990,
        category: "electronics",
        stock: 45,
        images: ["/images/electronics/sony-wh-1000xm5-noise-cancelling-headphones.jpg"]
    },
    {
        name: "Logitech MX Master 3S Wireless Mouse",
        description: "8K DPI Any-Surface Tracking, Quiet Clicks, and MagSpeed Scrolling.",
        price: 9995,
        category: "electronics",
        stock: 70,
        images: ["/images/electronics/logitech-mx-master-3s-mouse.jpg"]
    },
    {
        name: "Keychron K2 Pro Mechanical Keyboard",
        description: "Wireless mechanical keyboard with QMK/VIA support and hot-swappable keys.",
        price: 11999,
        category: "electronics",
        stock: 30,
        images: ["/images/electronics/keychron-k2-pro-mechanical-keyboard.jpg"]
    },
    {
        name: "JBL Flip 6 Wireless Bluetooth Speaker",
        description: "Bold sound, waterproof and dustproof design, and 12 hours of playtime.",
        price: 9999,
        category: "electronics",
        stock: 100,
        images: ["/images/electronics/jbl-flip-6-bluetooth-speaker.jpg"]
    },
    {
        name: "Apple iPad Air (5th Gen) - 64GB",
        description: "Supercharged by the Apple M1 chip. 10.9-inch Liquid Retina display.",
        price: 54900,
        category: "electronics",
        stock: 25,
        images: ["/images/electronics/apple-ipad-air-5th-gen-64gb.jpg"]
    },
    {
        name: "GoPro HERO12 Black",
        description: "Incredible image quality, even better HyperSmooth video stabilization, and huge battery boost.",
        price: 37990,
        category: "electronics",
        stock: 15,
        images: ["/images/electronics/gopro-hero12-black.jpg"]
    },
    {
        name: "Mi Power Bank 3i 20000mAh",
        description: "Triple Output, Dual Input, and 18W Fast Charging.",
        price: 2149,
        category: "electronics",
        stock: 200,
        images: ["/images/electronics/mi-power-bank-3i-20000mah.jpg"]
    },
    {
        name: "Philips Steam Iron GC1905",
        description: "1440 Watt power, continuous steam output, and non-stick soleplate.",
        price: 1599,
        category: "electronics",
        stock: 80,
        images: ["/images/electronics/philips-steam-iron-gc1905.jpg"]
    },
    // 👕 Fashion (5)
    {
        name: "Levi's Men's 511 Slim Fit Jeans",
        description: "Modern slim-fit jeans with room to move. The perfect alternative to skinny jeans.",
        price: 2699,
        category: "fashion",
        stock: 100,
        images: ["/images/fashion/levis-mens-511-slim-fit-jeans.jpg"]
    },
    {
        name: "Nike Air Jordan 1 Retro High",
        description: "The sneaker that started it all. Iconic design, premium leather, and Air cushioning.",
        price: 16995,
        category: "fashion",
        stock: 20,
        images: ["/images/fashion/nike-air-jordan-1-retro-high.jpg"]
    },
    {
        name: "Zara Floral Print Woven Dress",
        description: "Elegant floral print dress, perfect for summer outings and casual events.",
        price: 3990,
        category: "fashion",
        stock: 60,
        images: ["/images/fashion/zara-floral-print-woven-dress.jpg"]
    },
    {
        name: "Adidas Originals Men's T-Shirt",
        description: "Classic Trefoil tee made with soft cotton jersey for everyday comfort.",
        price: 2299,
        category: "fashion",
        stock: 150,
        images: ["/images/fashion/adidas-originals-mens-tshirt.jpg"]
    },
    {
        name: "Fossil Gen 6 Smartwatch",
        description: "Snapdragon Wear 4100+ platform, fast charging, and always-on display.",
        price: 23995,
        category: "fashion",
        stock: 40,
        images: ["/images/fashion/fossil-gen-6-smartwatch.jpg"]
    },

    // 🏠 Home & Kitchen (5)
    {
        name: "Prestige Svachh Pressure Cooker 3L",
        description: "Hard anodized pressure cooker with deep lid for spillage control.",
        price: 2100,
        category: "home-kitchen",
        stock: 60,
        images: ["/images/home-kitchen/prestige-svachh-pressure-cooker-3l.jpg"]
    },
    {
        name: "NutriBullet Pro High speed Blender",
        description: "900 Watts high torque power base for smoothies and nutrient extraction.",
        price: 8990,
        category: "home-kitchen",
        stock: 40,
        images: ["/images/home-kitchen/nutribullet-pro-high-speed-blender.jpg"]
    },
    {
        name: "Milton Thermosteel Water Bottle (1L)",
        description: "Vacuum insulated flask keeps liquid hot or cold for 24 hours.",
        price: 999,
        category: "home-kitchen",
        stock: 150,
        images: ["/images/home-kitchen/milton-thermosteel-water-bottle-1l.jpg"]
    },
    {
        name: "Wonderchef Granite Wok with Lid",
        description: "Non-stick granite coating, PFOA free, and induction friendly.",
        price: 2699,
        category: "home-kitchen",
        stock: 45,
        images: ["/images/home-kitchen/wonderchef-granite-wok-with-lid.jpg"]
    },
    {
        name: "Corelle Dinner Set (21 Pieces)",
        description: "Chip and break resistant, lightweight, and stackable dinnerware.",
        price: 8499,
        category: "home-kitchen",
        stock: 20,
        images: ["/images/home-kitchen/corelle-dinner-set-21-pieces.jpg"]
    },

    // 💄 Beauty (5)
    {
        name: "Maybelline New York Fit Me Foundation",
        description: "Matte + Poreless liquid foundation suitable for normal to oily skin.",
        price: 549,
        category: "beauty",
        stock: 150,
        images: ["/images/beauty/maybelline-fit-me-foundation.jpg"]
    },
    {
        name: "Lakmé Absolute Matte Melt Liquid Lip Color",
        description: "Velvet matte finish, intense color payoff, and long-lasting wear.",
        price: 750,
        category: "beauty",
        stock: 120,
        images: ["/images/beauty/lakme-absolute-matte-melt-liquid-lip-color.jpg"]
    },
    {
        name: "L'Oréal Paris Hyaluron Moisture Shampoo",
        description: "72-hour hydration, with Hyaluronic Acid for shiny and bouncy hair.",
        price: 399,
        category: "beauty",
        stock: 200,
        images: ["/images/beauty/loreal-paris-hyaluron-moisture-shampoo.jpg"]
    },
    {
        name: "Beardo Godfather Beard Oil",
        description: "Nourishes and strengthens beard, promotes growth, and adds shine.",
        price: 350,
        category: "beauty",
        stock: 100,
        images: ["/images/beauty/beardo-godfather-beard-oil.jpg"]
    },
    {
        name: "Clinique Moisture Surrogate 100H Auto-Replenishing Hydrator",
        description: "Gel-cream moisturizer that provides 100 hours of stabilizing hydration.",
        price: 2950,
        category: "beauty",
        stock: 50,
        images: ["/images/beauty/clinique-moisture-surrogate-100h-hydrator.jpg"]
    },

    // 🧸 Toys (5)
    {
        name: "LEGO Technic Ferrari Daytona SP3",
        description: "Build a highly detailed replica of the Ferrari Daytona SP3.",
        price: 39999,
        category: "toys",
        stock: 10,
        images: ["/images/toys/lego-technic-ferrari-daytona-sp3.jpg"]
    },
    {
        name: "Hot Wheels 10-Car Pack Set",
        description: "Set of 10 1:64 scale die-cast vehicles. Styles may vary.",
        price: 1499,
        category: "toys",
        stock: 200,
        images: ["/images/toys/hot-wheels-10-car-pack-set.jpg"]
    },
    {
        name: "Barbie Dreamhouse Dollhouse",
        description: "3-story dollhouse with 10 indoor and outdoor living areas.",
        price: 15499,
        category: "toys",
        stock: 15,
        images: ["/images/toys/barbie-dreamhouse-dollhouse.jpg"]
    },
    {
        name: "Monopoly Classic Board Game",
        description: "The fast-dealing property trading game for the whole family.",
        price: 999,
        category: "toys",
        stock: 100,
        images: ["/images/toys/monopoly-classic-board-game.jpg"]
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("📦 Connected to MongoDB (Product Service)");

        await Product.deleteMany({});
        console.log("Deleted old products");

        await Product.insertMany(products);
        console.log("✅ Data Seeded Successfully with 70+ Premium Products");

        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
