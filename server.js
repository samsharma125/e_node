// ============================
// 🌿 E-Commerce API Server
// ============================

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

<<<<<<< HEAD

=======
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

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

// ✅ Root route
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "E-commerce API running 🚀" });
});

// ============================
// 🔗 Import all route modules
// ============================
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
<<<<<<< HEAD

=======
const categoryRoutes = require("./routes/categoryRoutes");
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
const plantRoutes = require("./routes/plantRoutes");

const User = require("./models/User");

// ============================
// 🛣️ Use all routes
// ============================
app.use("/api/auth", authRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
<<<<<<< HEAD
app.use("/api/plants", plantRoutes);
app.use("/api/auth", authRoutes);
=======
app.use("/api/categories", categoryRoutes);
app.use("/api/plants", plantRoutes);
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58


// ============================
// ⚙️ Global error handler
// ============================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

// ============================
// 🚀 Start Server
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ============================
// 🧩 Auto-fix missing registeredAt
// ============================
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
