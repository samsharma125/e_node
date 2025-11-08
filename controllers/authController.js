const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// ✅ JWT now only stores user id
const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// 📍 Helper function to fetch location by IP
const getUserLocation = async (req) => {
  try {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (ip === "::1" || ip === "127.0.0.1") ip = "8.8.8.8"; // For local testing

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

// ------------------ REGISTER ------------------
exports.register = async (req, res, next) => {
  try {
    const { name, phone, password, addresses } = req.body;

    const existing = await User.findOne({ phone });
    if (existing)
      return res.status(409).json({ message: "Phone already registered" });

    const hashed = await bcrypt.hash(password, 10);

    // Get location info
    const location = await getUserLocation(req);

    const user = await User.create({
      name,
      phone,
      password: hashed,
      addresses: addresses || [],
      registeredAt: new Date(),
      location, // ✅ store location on registration
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        addresses: user.addresses,
        registeredAt: user.registeredAt,
        location: user.location, // ✅ include location in response
      },
    });
  } catch (err) {
    next(err);
  }
};

// ------------------ LOGIN ------------------
exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Fetch latest location on login
    const location = await getUserLocation(req);
    if (location) {
      user.location = location;
      await user.save();
    }

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        addresses: user.addresses,
        registeredAt: user.registeredAt,
        location: user.location, // ✅ return latest location
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
    res.json(user);
  } catch (err) {
    next(err);
  }
};
