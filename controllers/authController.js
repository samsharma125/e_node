const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// ✅ JWT token for 15 days
const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15d" });

// 🌍 Helper function to fetch location using IP
const getUserLocation = async (req) => {
  try {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (ip === "::1" || ip === "127.0.0.1") ip = "8.8.8.8"; // localhost fix

    const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
    return {
      ip,
      city: data.city,
      region: data.regionName,
      country: data.country,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Location fetch failed:", error.message);
    return null;
  }
};
// ------------------ REGISTER ------------------// ------------------ REGISTER ------------------
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      password,
      street,
      landmark,
      city,
      state,
      pincode,
      country
    } = req.body;

    // REQUIRED FIELD VALIDATION
    if (!name || !phone || !password || !street || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: name, phone, password, street, city, state, pincode.",
      });
    }

    // Check existing user
    const existing = await User.findOne({ phone });
    if (existing)
      return res.status(409).json({ message: "Phone already registered" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Fetch location
    const location = await getUserLocation(req);

    // Create user
    const user = await User.create({
      name,
      phone,
      password: hashed,
      street,
      landmark,
      city,
      state,
      pincode,
      country,
      registeredAt: new Date(),
      location,
    });

    const token = signToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        street: user.street,
        landmark: user.landmark,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        country: user.country,
        registeredAt: user.registeredAt,
        location: user.location,
      },
    });
  } catch (err) {
    next(err);
  }
};



// ------------------ LOGIN ------------------// ------------------ LOGIN ------------------// ------------------ LOGIN ------------------
exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const location = await getUserLocation(req);

    const loginData = {
      time: new Date(),
      location: location
        ? { ip: location.ip, city: location.city, country: location.country }
        : {},
    };

    user.lastLogin = loginData.time;
    user.location = location;

    if (!user.loginHistory) user.loginHistory = [];
    user.loginHistory.push(loginData);

    await user.save();

    const token = signToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        street: user.street,
        landmark: user.landmark,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        country: user.country,
        registeredAt: user.registeredAt,
        lastLogin: user.lastLogin,
        location: user.location,
      },
    });
  } catch (err) {
    next(err);
  }
};




// ------------------ PROFILE (ME) ------------------
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};
