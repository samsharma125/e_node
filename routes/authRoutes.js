const express = require("express");
const router = express.Router();
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

    // Validate required fields
    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, phone, and password.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone.",
      });
    }

    // Parse addresses if provided
    let parsedAddresses = [];
    if (addresses) {
      try {
        parsedAddresses = JSON.parse(decodeURIComponent(addresses));
      } catch {
        parsedAddresses = [{ label: addresses }];
      }
    }

    // Create new user
    const newUser = new User({
      name,
      phone,
      password,
      addresses: parsedAddresses,
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
        registeredAt: new Date(newUser.registeredAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
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

    req.body = { phone, password }; // reuse controller logic
    return await login(req, res, next);
  } catch (err) {
    next(err);
  }
});

/* --------------------------------
   🔹 GET /register/users → Get all registered users
-------------------------------- */
router.get("/register/users", async (req, res) => {
  try {
    const users = await User.find({}, "name phone registeredAt");

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No registered users found.",
      });
    }

    const formatted = users.map((u) => ({
      id: u._id,
      name: u.name,
      phone: u.phone,
      registeredAt: u.registeredAt
        ? new Date(u.registeredAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })
        : "Not Available",
    }));

    res.status(200).json({
      success: true,
      total_registered_users: formatted.length,
      registered_users: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching registered users",
      error: error.message,
    });
  }
});

/* --------------------------------
   🔹 GET /login/users → Get all users who have logged in
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
