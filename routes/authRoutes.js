// ✅ routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { register, login, me } = require("../controllers/authController");
const User = require("../models/User");

/* --------------------------------
   🔹 POST ROUTES
-------------------------------- */
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);

/* --------------------------------
   🔹 GET /register (Demo Registration)
-------------------------------- */
router.get("/register", async (req, res) => {
  try {
    const { name, phone, password, addresses } = req.query;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, phone, password",
      });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone",
      });
    }

    // Parse addresses optionally
    let parsedAddresses = [];
    if (addresses) {
      try {
        parsedAddresses = JSON.parse(decodeURIComponent(addresses));
      } catch {
        parsedAddresses = [{ label: addresses }];
      }
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashed,
      addresses: parsedAddresses,
      location: { ip, lastUpdated: new Date() },
      registeredAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully (demo)",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        ip,
        registeredAt: new Date(user.registeredAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: err.message,
    });
  }
});

/* --------------------------------
   🔹 GET /login (Demo Login)
-------------------------------- */
router.get("/login", async (req, res, next) => {
  try {
    const { phone, password } = req.query;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required",
      });
    }

    req.body = { phone, password }; // forward to POST login controller
    return await login(req, res, next);
  } catch (err) {
    next(err);
  }
});

/* --------------------------------
   🔹 GET /register/users (All Registered Users)
-------------------------------- */
router.get("/register/users", async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name phone label line1 line2 city state pincode country ip registeredAt"
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No registered users found",
      });
    }

    const formatted = users.map((u) => {
      const token = jwt.sign(
        { id: u._id },
        process.env.JWT_SECRET || "dev_secret",
        { expiresIn: "15d" }
      );

      return {
        id: u._id,
        token, // ⭐ token for each registered user

        name: u.name,
        phone: u.phone,

        label: u.label,
        line1: u.line1,
        line2: u.line2,
        city: u.city,
        state: u.state,
        pincode: u.pincode,
        country: u.country,

        ip: u.ip || "Not Available",

        registeredAt: new Date(u.registeredAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      };
    });

    return res.status(200).json({
      success: true,
      total_registered_users: formatted.length,
      registered_users: formatted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching registered users",
      error: err.message,
    });
  }
});

/* --------------------------------
   🔹 GET /login/users (All Logged-In Users)
-------------------------------- */
router.get("/login/users", async (req, res) => {
  try {
    const users = await User.find(
      { lastLogin: { $exists: true, $ne: null } },
      "name phone lastLogin label line1 line2 city state pincode country ip"
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users have logged in yet",
      });
    }

    const formatted = users.map((u) => {
      const token = jwt.sign(
        { id: u._id },
        process.env.JWT_SECRET || "dev_secret",
        { expiresIn: "15d" }
      );

      return {
        id: u._id,
        token, // ⭐ token for logged-in user

        name: u.name,
        phone: u.phone,

        label: u.label,
        line1: u.line1,
        line2: u.line2,
        city: u.city,
        state: u.state,
        pincode: u.pincode,
        country: u.country,

        ip: u.ip,

        lastLogin: new Date(u.lastLogin).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      };
    });

    return res.status(200).json({
      success: true,
      total_logged_in_users: formatted.length,
      logged_in_users: formatted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching login users",
      error: err.message,
    });
  }
});

module.exports = router;
