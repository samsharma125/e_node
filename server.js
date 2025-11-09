const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

const categoryRoutes = require("./routes/categoryRoutes");  // 🌿 For plant categories
const plantRoutes = require("./routes/plantRoutes");        // 🌱 For individual plants


const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const User = require("./models/User");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Serve static uploads
app.use("/uploads", express.static(uploadsDir));

// Root route
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "E-commerce API running" });
});

// ✅ Attach routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));



// ✅ Auto-fix users missing registeredAt date
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

// ✅ Attach plant and category routes
app.use("/api/categories", categoryRoutes);
app.use("/api/plants", plantRoutes);






// Run on startup
fixMissingRegisteredDates();