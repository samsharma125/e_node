<<<<<<< HEAD
// ✅ routes/authRoutes.js
=======
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { register, login, me } = require("../controllers/authController");
const User = require("../models/User");

/* --------------------------------
   🔹 POST routes (used by frontend / app)
-------------------------------- */
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);

/* --------------------------------
   🔹 GET /register → Register new user (for testing/demo)
-------------------------------- */
router.get("/register", async (req, res) => {
  try {
    const { name, phone, password, addresses } = req.query;

<<<<<<< HEAD
=======
    // ✅ Validate required fields
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, phone, and password.",
      });
    }

<<<<<<< HEAD
=======
    // ✅ Check if user already exists
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone.",
      });
    }

<<<<<<< HEAD
    // Parse optional addresses
=======
    // ✅ Parse addresses (if provided)
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
    let parsedAddresses = [];
    if (addresses) {
      try {
        parsedAddresses = JSON.parse(decodeURIComponent(addresses));
      } catch {
        parsedAddresses = [{ label: addresses }];
      }
    }

<<<<<<< HEAD
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
=======
    // ✅ Capture IP address
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    // ✅ Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
      addresses: parsedAddresses,
      location: { ip, lastUpdated: new Date() },
      registeredAt: new Date(),
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "✅ User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        ip: ip,
        registeredAt: new Date(newUser.registeredAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
<<<<<<< HEAD
        password: password, // only for demo/testing
        hashedPassword: newUser.password,
=======
        password: password, // plain (for testing)
        hashedPassword: newUser.password, // stored securely
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
      },
    });
  } catch (err) {
    console.error("Error in GET /register:", err.message);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: err.message,
    });
  }
});

/* --------------------------------
   🔹 GET /login → Login user via query params
-------------------------------- */
router.get("/login", async (req, res, next) => {
  try {
    const { phone, password } = req.query;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required.",
      });
    }

<<<<<<< HEAD
    req.body = { phone, password };
=======
    req.body = { phone, password }; // reuse controller logic
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
    return await login(req, res, next);
  } catch (err) {
    next(err);
  }
});
<<<<<<< HEAD

/* --------------------------------
   🔹 PUBLIC: GET /register/users → All registered users (safe list)
-------------------------------- */
router.get("/register/users", async (req, res) => {
  try {
    const users = await User.find({}, "name phone addresses location registeredAt");
=======
/* --------------------------------
   🔹 GET /register/users → All registered users
   - Default: public (no passwords)
   - ?showPassword=true → Admin only
-------------------------------- */
router.get("/register/users", auth, async (req, res) => {
  try {
    const { showPassword } = req.query;

    // 🧠 Only allow admin to see passwords
    if (showPassword === "true" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required to view passwords.",
      });
    }

    const projection =
      "name phone addresses location registeredAt" +
      (showPassword === "true" ? " password" : "");

    const users = await User.find({}, projection);
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No registered users found.",
      });
    }

    const formatted = users.map((u) => ({
      id: u._id,
      name: u.name,
      phone: u.phone,
      addresses: u.addresses || [],
      ip: u.location?.ip || "Not Available",
<<<<<<< HEAD
=======
      ...(showPassword === "true" && { password: u.password }),
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
      registeredAt: new Date(u.registeredAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    }));

    res.status(200).json({
      success: true,
      total_registered_users: formatted.length,
      registered_users: formatted,
    });
  } catch (error) {
<<<<<<< HEAD
    console.error("Error fetching registered users:", error.message);
=======
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
    res.status(500).json({
      success: false,
      message: "Error fetching registered users",
      error: error.message,
    });
  }
});

<<<<<<< HEAD
/* --------------------------------
   ⚠️ DEBUG ONLY: GET /register/users-all → All users with hashed passwords
-------------------------------- */
router.get("/register/users-all", async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name phone password addresses location registeredAt"
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No registered users found.",
      });
    }

    const formatted = users.map((u) => ({
      id: u._id,
      name: u.name,
      phone: u.phone,
      password: u.password, // hashed password
      addresses: u.addresses || [],
      ip: u.location?.ip || "Not Available",
      registeredAt: new Date(u.registeredAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    }));

    res.status(200).json({
      success: true,
      total_registered_users: formatted.length,
      registered_users: formatted,
    });
  } catch (error) {
    console.error("Error fetching registered users (with password):", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching registered users with password",
      error: error.message,
    });
  }
});

/* --------------------------------
   🔹 GET /login/users → Users who have logged in
=======


/* --------------------------------
   🔹 GET /login/users → Get all users who have logged in
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
-------------------------------- */
router.get("/login/users", async (req, res) => {
  try {
    const loggedInUsers = await User.find(
      { lastLogin: { $exists: true, $ne: null } },
      "name phone lastLogin"
    );

    if (!loggedInUsers || loggedInUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users have logged in yet.",
      });
    }

    const formatted = loggedInUsers.map((u) => ({
      id: u._id,
      name: u.name,
      phone: u.phone,
      lastLogin: u.lastLogin
        ? new Date(u.lastLogin).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })
        : "Not Available",
    }));

    res.status(200).json({
      success: true,
      total_logged_in_users: formatted.length,
      logged_in_users: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching logged-in users",
      error: error.message,
    });
  }
});

module.exports = router;
