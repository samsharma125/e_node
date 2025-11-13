// ============================
// 🌿 Unified E-Commerce + Plants API Server
// ============================

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const connectDB = require("./config/db");
const User = require("./models/User");
const Category = require("./models/Category");
const Plant = require("./models/Plant");
const sellerRoutes = require("./routes/sellerRoutes");

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Express app
const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Ensure 'uploads' folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// ✅ Serve static files (uploads)
app.use("/uploads", express.static(uploadsDir));

// ✅ Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Root route
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "🌿 E-commerce + Plants API running 🚀" });
});

// ============================
// 🔗 Import route modules
// ============================
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const plantRoutes = require("./routes/plantRoutes");

// ============================
// 🛣️ Use all routes
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plants", plantRoutes);
// Existing app.use routes...
app.use("/api/sellers", sellerRoutes);

/* ---------------------------------------------
   ✅ Seeder Route for Categories + Plants
--------------------------------------------- */
app.get("/api/seed", async (req, res) => {
  try {
    // Drop wrong indexes (if any)
    await mongoose.connection.db.collection("categories").dropIndexes().catch(() => {});
    await mongoose.connection.db.collection("plants").dropIndexes().catch(() => {});

    // Clear old data
    await Category.deleteMany({});
    await Plant.deleteMany({});

    // Categories
    
    // 🌿 Category data
   const categories = [
  {
    category_name: "Indoor Plants",
    category_id: 1,
    image_url: "https://drive.google.com/yourimage1", // clickable image
  },
  {
    category_name: "Ornamental Plants",
    category_id: 2,
    image_url: "https://drive.google.com/yourimage2",
  },
  {
    category_name: "Edible Plants",
    category_id: 3,
    image_url: "https://drive.google.com/yourimage3",
  },
  {
    category_name: "Medicinal Plants",
    category_id: 4,
    image_url: "https://drive.google.com/yourimage4",
  },
  {
    category_name: "Outdoor Plants",
    category_id: 5,
    image_url: "https://drive.google.com/yourimage5",
  },
  {
    category_name: "Air Purify Plants",
    category_id: 6,
    image_url: "https://drive.google.com/yourimage6",
  },
  {
    category_name: "Climber Plants",
    category_id: 7,
    image_url: "https://drive.google.com/yourimage7",
  },
  {
    category_name: "Herbs Plants",
    category_id: 8,
    image_url: "https://drive.google.com/yourimage8",
  }
];

    // 🌱 All Plant Data// 🌱 All Plant Data
const plants = [
  // ========== INDOOR ==========
  {
    plant_name: "Money Plant",
    category_id: 1,
    plant_photo_url: "https://drive.google.com/file/d/11qTD9sSPqBd1GCcdc4_ZcwaPiMF1Wcyt/view?usp=drive_link",
    description:
      "The Money Plant is a lush green indoor vine known for bringing prosperity and positive energy. Its heart-shaped leaves symbolize growth, wealth, and good luck in every home.",
    plant_id: 11,
  },
  {
    plant_name: "Areca Palm",
    category_id: 1,
    plant_photo_url: "https://drive.google.com/file/d/1U3cg8l-o_Ona7TwiG6pN_wGbH0xdULai/view?usp=drive_link",
    description:
      "The Areca Palm is a vibrant air-purifying plant with feathery fronds that add a tropical touch to any space. It helps remove toxins and promotes a calm, refreshing atmosphere.",
    plant_id: 12,
  },
  {
    plant_name: "ZZ Plant",
    category_id: 1,
    plant_photo_url: "https://drive.google.com/file/d/1RziRcGKf6bkrt1yAugd1a5ipxpp1vdtM/view?usp=drive_link",
    description:
      "The ZZ Plant is a hardy indoor plant with shiny green leaves that thrive even in low light. It symbolizes prosperity, endurance, and positivity.",
    plant_id: 13,
  },
  {
    plant_name: "Snake Plant",
    category_id: 1,
    plant_photo_url: "https://drive.google.com/file/d/1Tc1lM7XbbB5251GCv8dERrNOpNCD8uBC/view?usp=drive_link",
    description:
      "The Snake Plant is a tough, air-purifying plant with upright sword-like leaves. It filters indoor air, releases oxygen at night, and adds elegance to any space.",
    plant_id: 14,
  },
  
  {
    plant_name: "Monstera Deliciosa",
    category_id: 1,
    plant_photo_url: "https://drive.google.com/file/d/1RkKG7Lv_BdbFL-725Sq37mvswj4cCsKp/view?usp=drive_link",
    description:
      "The Monstera Deliciosa, or Swiss Cheese Plant, features large perforated leaves that bring a bold tropical vibe indoors. It represents growth, vitality, and abundance.",
    plant_id: 15,
  },
  {
    plant_name: "Peace Lily",
    category_id: 1,
    plant_photo_url: "https://drive.google.com/file/d/1Hhw7qbmQ8rfA9NqXrpKDFcKVh5VjPf-1/view?usp=drive_link",
    description:
      "The Peace Lily is a beautiful indoor plant with white blooms symbolizing peace and purity. It purifies the air and thrives well in low-light areas.",
    plant_id: 16,
  },

  // ========== ORNAMENTAL ==========
  {
    plant_name: "Orchid",
    category_id: 2,
    plant_photo_url: "https://drive.google.com/file/d/1oGYHdXUnwwjq9Y8Hd13Y6pm7gOukkOlj/view?usp=drive_link",
    description:
      "The Orchid is a stunning flowering plant known for its exotic beauty and long-lasting blooms. It thrives in bright outdoor spots, adding elegance and color to gardens and balconies.",
    plant_id: 21,
  },
  {
    plant_name: "Anthurium",
    category_id: 2,
    plant_photo_url: "https://drive.google.com/file/d/1USe6Y_StM-Jc91X0B6t-ahx_Ap37kysz/view?usp=drive_link",
    description:
      "The Anthurium, also called the Flamingo Flower, is admired for its glossy heart-shaped leaves and vibrant red blooms. It brings a tropical charm and symbolizes hospitality and happiness.",
    plant_id: 22,
  },
  {
    plant_name: "Kalanchoe",
    category_id: 2,
    plant_photo_url: "https://drive.google.com/file/d/1-7nV5OICRETwR3-aKCBC3F0kxeEyBMzK/view?usp=drive_link",
    description:
      "The Kalanchoe is a colorful succulent that produces clusters of bright flowers. It’s drought-tolerant and easy to grow outdoors, symbolizing endurance and cheerful energy.",
    plant_id: 23,
  },
  {
    plant_name: "Begonia (Elatior)",
    category_id: 2,
    plant_photo_url: "https://drive.google.com/file/d/13AhiEoDJpaHEXkOHOGKjlwIT_Cs-Z9Mm/view?usp=drive_link",
    description:
      "The Begonia Elatior is a vibrant outdoor plant with lush green leaves and beautiful rose-like blooms. It thrives in shaded garden areas, adding color and freshness to any landscape.",
    plant_id: 24,
  },
  {
    plant_name: "Bromeliad",
    category_id: 2,
    plant_photo_url: "https://drive.google.com/file/d/1qRL872x6x1MF3MXxRuZrypd8LY_5flgP/view?usp=drive_link",
    description:
      "The Bromeliad is a tropical outdoor plant known for its colorful rosette-shaped flowers and striking foliage. It’s easy to care for and adds a bright, exotic touch to gardens.",
    plant_id: 25,
  },
  {
    plant_name: "Peace Lily (Outdoor)",
    category_id: 2,
    plant_photo_url: "https://drive.google.com/file/d/1Hhw7qbmQ8rfA9NqXrpKDFcKVh5VjPf-1/view?usp=drive_link",
    description:
      "The Peace Lily is a graceful outdoor plant with white blooms symbolizing peace and renewal. It thrives in shaded outdoor areas and purifies the air naturally.",
    plant_id: 26,
  },

  // ========== EDIBLE ==========
  {
    plant_name: "Aloe Vera",
    category_id: 3,
    plant_photo_url: "https://drive.google.com/file/d/11UsSBbK5Fk5F6FaSz1xWVz0e-NO7imHG/view?usp=drive_link",
    description:
      "Aloe Vera is a succulent plant known for its medicinal and edible gel, rich in vitamins and antioxidants. It’s used for skin care, digestion, and overall wellness.",
    plant_id: 31,
  },
  {
    plant_name: "Pudina (Mint)",
    category_id: 3,
    plant_photo_url: "https://drive.google.com/file/d/1fZJOn9QdkYqSii4-yAEL_xKWofhcDh5l/view?usp=drive_link",
    description:
      "Mint is a refreshing herb widely used in chutneys, teas, and dishes. Its aromatic leaves promote digestion and add a cooling flavor to food and drinks.",
    plant_id: 32,
  },
  {
    plant_name: "Curry Patta(Curry Leaf) ",
    category_id: 3,
    plant_photo_url: "https://drive.google.com/file/d/1AMIlwQYcepSLLDk5ZnZaOgEHnCEjLS33/view?usp=drive_link",
    description:
      "The Curry Leaf Plant is an aromatic herb whose leaves are used to flavor Indian dishes. It’s packed with antioxidants and adds a distinct, savory aroma to curries.",
    plant_id: 33,
  },
  {
    plant_name: "Dhaniya (Coriander)",
    category_id: 3,
    plant_photo_url: "https://drive.google.com/file/d/1MuvklDsPpRuQxJwYFFpmUWH9N4o7Fv_D/view?usp=drive_link",
    description:
      "Coriander is a popular kitchen herb used for garnishing and flavoring. Its fresh green leaves and seeds enhance taste while offering health benefits.",
    plant_id: 34,
  },
  {
    plant_name: "Mirchi (Chilli Plant)",
    category_id: 3,
    plant_photo_url: "https://drive.google.com/file/d/1ESfy9NqCqERkGB0u4mRztGy0S3O490fU/view?usp=drive_link",
    description:
      "The Chilli Plant produces vibrant green or red chilies that add spice and flavor to dishes. It’s easy to grow and thrives well in sunny outdoor spaces.",
    plant_id: 35,
  },
  {
    plant_name: "Adrak (Ginger)",
    category_id: 3,
    plant_photo_url: "https://drive.google.com/file/d/1MuvklDsPpRuQxJwYFFpmUWH9N4o7Fv_D/view?usp=drive_link",
    description:
      "Ginger is a medicinal and edible root plant known for its spicy, aromatic flavor. It’s widely used in teas, dishes, and remedies for cold and digestion.",
    plant_id: 36,
  },

  // ========== MEDICINAL ==========
  {
    plant_name: "Ashwagandha",
    category_id: 4,
    plant_photo_url: "https://drive.google.com/file/d/17srAfNXXjfMv3AeaGMN33i5Lz5ioho5e/view?usp=drive_link",
    description:
      "Ashwagandha is a powerful medicinal herb known for reducing stress, boosting energy, and improving overall strength. It’s often called ‘Indian Ginseng’ for its healing benefits.",
    plant_id: 41,
  },
  {
    plant_name: "Brahmi",
    category_id: 4,
    plant_photo_url: "https://drive.google.com/file/d/17srAfNXXjfMv3AeaGMN33i5Lz5ioho5e/view?usp=drive_link",
    description:
      "Brahmi is a traditional Ayurvedic herb that enhances memory, focus, and mental clarity. It is widely used to relieve anxiety and promote brain health.",
    plant_id: 42,
  },
  {
    plant_name: "Giloy",
    category_id: 4,
    plant_photo_url: "https://drive.google.com/file/d/1zPUd4V-rjlKKNyXWkpeSvZr3z8d8LTi7/view?usp=drive_link",
    description:
      "Giloy, also known as Guduchi, is an immunity-boosting plant that helps fight infections and detoxify the body. It’s known as the ‘Amrit’ or divine herb in Ayurveda.",
    plant_id: 43,
  },
  {
    plant_name: "Guduchi",
    category_id: 4,
    plant_photo_url: "https://drive.google.com/file/d/1zPUd4V-rjlKKNyXWkpeSvZr3z8d8LTi7/view?usp=drive_link",
    description:
      "Guduchi is a rejuvenating herb used to enhance immunity, reduce fever, and purify blood. It’s often consumed as juice or powder for overall wellness.",
    plant_id: 44,
  },
  {
    plant_name: "Lemon Balm",
    category_id: 4,
    plant_photo_url: "https://drive.google.com/file/d/1_HnG2gKRtX49VO2KMSk4h4IZLXKJ5vt7/view?usp=drive_link",
    description:
      "Lemon Balm is a soothing medicinal herb with a lemony scent that helps reduce stress, improve sleep, and promote relaxation naturally.",
    plant_id: 45,
  },
  {
    plant_name: "Spearmint",
    category_id: 4,
    plant_photo_url: "https://drive.google.com/file/d/1lvThgMeRsq8VME822NXZTgQ3CnkZJZek/view?usp=drive_link",
    description:
      "Spearmint is a gentle herb known for its fresh aroma and digestive benefits. It helps relieve nausea, stress, and supports clear breathing.",
    plant_id: 46,
  },
  {
    plant_name: "Haldi (Turmeric)",
    category_id: 4,
    plant_photo_url: "https://drive.google.com/file/d/1grtKkA5P_kbLvcv_fyfABScol7Ocv4aU/view?usp=drive_link",
    description:
      "Turmeric is a golden medicinal spice with strong anti-inflammatory and healing properties. It boosts immunity and promotes glowing skin and joint health.",
    plant_id: 47,
  },

  // ========== OUTDOOR ==========
  {
    plant_name: "Areca Palm (Outdoor)",
    category_id: 5,
    plant_photo_url: "https://drive.google.com/file/d/1U3cg8l-o_Ona7TwiG6pN_wGbH0xdULai/view?usp=drive_link",
    description:
      "The Areca Palm is a lush tropical plant with feather-like fronds that purify the air and bring a refreshing, green vibe to outdoor spaces.",
    plant_id: 51,
  },
  {
    plant_name: "Ficus Panda",
    category_id: 5,
    plant_photo_url: "https://drive.google.com/file/d/1yb6n2RPQul3nh54P7_A7yAasrRi7aLdp/view?usp=drive_link",
    description:
      "Ficus Panda is a compact ornamental tree with dense, round leaves that make it ideal for outdoor landscaping. It’s hardy and evergreen.",
    plant_id: 52,
  },
  {
    plant_name: "Polyscias/Aralia",
    category_id: 5,
    plant_photo_url: "https://drive.google.com/file/d/1a0KnBQ9AOL4Mg-IA5PcJm_2fqsNhmCN_/view?usp=drive_link",
    description:
      "Polyscias, also known as Aralia, is a decorative shrub that adds elegance to outdoor gardens and thrives in tropical climates.",
    plant_id: 53,
  },
  {
    plant_name: "Golden Thuja",
    category_id: 5,
    plant_photo_url: "https://drive.google.com/file/d/1PJ7sjWKKCD2wgYV-ol0rHIminM-Qbs9R/view?usp=drive_link",
    description:
      "The Golden Thuja is a coniferous shrub with bright yellow-green foliage. It’s perfect for hedges, borders, and garden décor.",
    plant_id: 54,
  },
  {
    plant_name: "Croton",
    category_id: 5,
    plant_photo_url: "https://drive.google.com/file/d/1O2bYKkoSS7BRG08hE0xM4sxiWBfZ4ku9/view?usp=drive_link",
    description:
      "Croton is an ornamental plant with bold, multicolored leaves in shades of red, yellow, and green. It adds a tropical burst of color to any garden.",
    plant_id: 55,
  },
  {
    plant_name: "Ficus Benghalensis (Banyan)",
    category_id: 5,
    plant_photo_url: "https://drive.google.com/file/d/1fXdrpVG-NhSRB8F8GbanJ0QxZ4J9Rj3c/view?usp=drive_link",
    description:
      "The Banyan tree symbolizes longevity and strength. It provides deep shade and supports diverse ecosystems.",
    plant_id: 56,
  },

  // ========== AIR PURIFY ==========
  {
    plant_name: "Spider Plant",
    category_id: 6,
    plant_photo_url: "https://drive.google.com/file/d/1jE2v-xhz2cEX-PGZpa0fwU7WesC8HhRG/view?usp=drive_link",
    description:
      "The Spider Plant removes indoor toxins like carbon monoxide and formaldehyde while adding freshness to any space.",
    plant_id: 61,
  },
  {
    plant_name: "Rubber Plant",
    category_id: 6,
    plant_photo_url: "https://drive.google.com/file/d/1b0G3W8m5HpKq3WoyHuKAB5PhGbJjQG2n/view?usp=drive_link",
    description:
      "The Rubber Plant absorbs toxins and increases oxygen levels. It’s perfect for homes and offices, promoting cleaner air.",
    plant_id: 62,
  },
  {
    plant_name: "Bamboo Palm",
    category_id: 6,
    plant_photo_url: "https://drive.google.com/file/d/1ZGJdU5yQy72HfkGAvphgY8_Dhf00bjNb/view?usp=drive_link",
    description:
      "The Bamboo Palm filters indoor air pollutants and adds tropical charm. It thrives in shaded areas and naturally humidifies air.",
    plant_id: 63,
  },
  {
    plant_name: "Dracaena Marginata",
    category_id: 6,
    plant_photo_url: "https://drive.google.com/file/d/1e3hIMfymbtXCy1TIEkkO9FnTvDV4fCpy/view?usp=drive_link",
    description:
      "The Dragon Tree removes harmful toxins from the air. It’s a stylish, low-maintenance plant perfect for purifying indoor spaces.",
    plant_id: 64,
  },
  {
    plant_name: "Boston Fern",
    category_id: 6,
    plant_photo_url: "https://drive.google.com/file/d/19rGx14GDvdktqCRsKi_QtxzXY7aSbFIh/view?usp=drive_link",
    description:
      "The Boston Fern effectively removes formaldehyde and xylene from indoor air. It adds freshness and humidity while enhancing décor.",
    plant_id: 65,
  },
  {
    plant_name: "Peace Lily (Air Purify)",
    category_id: 6,
    plant_photo_url: "https://drive.google.com/file/d/1Hhw7qbmQ8rfA9NqXrpKDFcKVh5VjPf-1/view?usp=drive_link",
    description:
      "The Peace Lily removes mold spores and VOCs. Its white blooms symbolize purity and calm, ideal for homes and offices.",
    plant_id: 66,
  },

  // ========== CLIMBER ==========
  {
    plant_name: "Climbing Rose",
    category_id: 7,
    plant_photo_url: "https://drive.google.com/file/d/19fSWMqqdCHR-kkmX_y1byCvwttOedl0w/view?usp=drive_link",
    description:
      "The Climbing Rose is a stunning vine producing clusters of fragrant blooms. Perfect for trellises and fences, adding romance to outdoor spaces.",
    plant_id: 71,
  },
  {
    plant_name: "Star Jasmine",
    category_id: 7,
    plant_photo_url: "https://drive.google.com/file/d/105c2O46wUh7rOWt5ZFg0jk-lsAknQOog/view?usp=drive_link",
    description:
      "Star Jasmine is a fragrant climber with star-shaped white flowers that fill the air with a sweet aroma.",
    plant_id: 72,
  },
  {
    plant_name: "Flame Vine (Pyrostegia)",
    category_id: 7,
    plant_photo_url: "https://drive.google.com/file/d/1RhDpDU0MO4noft5b83FLv_2SLyRxLR40/view?usp=drive_link",
    description:
      "The Flame Vine is a vibrant orange-flowering climber that lights up garden walls and attracts butterflies.",
    plant_id: 73,
  },
  {
    plant_name: "Clematis",
    category_id: 7,
    plant_photo_url: "https://drive.google.com/file/d/1BIb-4fMqflHwOUknuubpLGiXGnLlz_f5/view?usp=drive_link",
    description:
      "Clematis is a flowering climber in various colors, perfect for trellises and pergolas.",
    plant_id: 74,
  },
  {
    plant_name: "Morning Glory",
    category_id: 7,
    plant_photo_url: "https://drive.google.com/file/d/1vbeW7fdI1VTi9j4gzaqV35dxzRcUl53w/view?usp=drive_link",
    description:
      "Morning Glory is a fast-growing vine with trumpet-shaped flowers that bloom at sunrise.",
    plant_id: 75,
  },
  {
    plant_name: "English Ivy",
    category_id: 7,
    plant_photo_url: "https://drive.google.com/file/d/1GNcCvB_9QyjXYXBGffNDCxG5nw1XGd9O/view?usp=drive_link",
    description:
      "English Ivy is a classic climbing plant with lush green leaves that purify air and add timeless natural charm.",
    plant_id: 76,
  },

  // ========== HERBS ==========
  {
    plant_name: "Rosemary",
    category_id: 8,
    plant_photo_url: "https://drive.google.com/file/d/18-bUWM-4M3ME0qQ0HqeQ0-czM5wEIAXC/view?usp=drive_link",
    description:
      "Rosemary is a fragrant herb with needle-like leaves, used in cooking and medicine. It boosts memory, improves digestion, and adds aroma to dishes.",
    plant_id: 81,
  },
  {
    plant_name: "Thyme",
    category_id: 8,
    plant_photo_url: "https://drive.google.com/file/d/11lsAmJ5SLG0y9-7zWmnJol8JQvBIHl7k/view?usp=drive_link",
    description:
      "Thyme is a flavorful herb used for seasoning and remedies. It has antiseptic properties and adds earthy taste to dishes.",
    plant_id: 82,
  },
  {
    plant_name: "Oregano",
    category_id: 8,
    plant_photo_url: "https://drive.google.com/file/d/1T-cZOmMw_LPPCuo4U7RjKsmp25_pxOsL/view?usp=drive_link",
    description:
      "Oregano is a Mediterranean herb known for its aroma and antibacterial benefits. Commonly used in pizzas and sauces.",
    plant_id: 83,
  },
  {
    plant_name: "Coriander(Cilantro)",
    category_id: 8,
    plant_photo_url: "https://drive.google.com/file/d/1nuksM9pMDmRpet62UgWI-RNK5hJvCE_i/view?usp=drive_link",
    description:
      "Coriander adds fresh flavor to dishes and supports digestion and immunity.",
    plant_id: 84,
  },
 
  {
    plant_name: "Sage",
    category_id: 8,
    plant_photo_url: "https://drive.google.com/file/d/15-aYomQyn-kehPRkP9WuCAY35p3-br5a/view?usp=drive_link",
    description:
      "Sage is an aromatic herb with gray-green leaves known for supporting memory and easing throat issues.",
    plant_id: 86,
  },
  {
    plant_name: "Chives",
    category_id: 8,
    plant_photo_url: "https://drive.google.com/file/d/1UC1OKB1BM6v3vtKLTmQtUJS2r-SZskxJ/view?usp=drive_link",
    description:
      "Chives are slender herbs with mild onion flavor, great for garnishing dishes and promoting health.",
    plant_id: 87,
  },
];


    // Insert data
    await Category.insertMany(categories);
    await Plant.insertMany(plants);

    res.status(200).json({
      success: true,
      message: "✅ All categories & plants seeded successfully!",
    });
  } catch (err) {
    console.error("❌ Seeding error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ---------------------------------------------
   ✅ Fetch Categories & Plants
--------------------------------------------- */
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/plants", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/plants/category/:id", async (req, res) => {
  try {
    const plants = await Plant.find({ category_id: req.params.id });
    res.status(200).json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------------------------
   ✅ Global Error Handler
--------------------------------------------- */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

/* ---------------------------------------------
   ✅ Auto-Fix Missing registeredAt
--------------------------------------------- */
const fixMissingRegisteredDates = async () => {
  try {
    const users = await User.find({
      $or: [{ registeredAt: { $exists: false } }, { registeredAt: null }],
    });

    if (users.length > 0) {
      for (const user of users) {
        user.registeredAt = user.createdAt || new Date();
        await user.save();
      }
      console.log(`✅ Fixed registeredAt for ${users.length} users`);
    } else {
      console.log("✅ All users have registeredAt dates");
    }
  } catch (err) {
    console.error("❌ Date fix error:", err.message);
  }
};

// Run on startup
fixMissingRegisteredDates();

/* ---------------------------------------------
   🚀 Start Server
--------------------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌿 Server running on port ${PORT}`));
