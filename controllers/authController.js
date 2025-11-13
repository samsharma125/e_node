// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// helper: sign token
const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "15d",
  });

// helper: fetch location (graceful)
const getUserLocation = async (req) => {
  try {
    let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    if (ip === "::1" || ip === "127.0.0.1") ip = "8.8.8.8";
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
  } catch (err) {
    console.error("getUserLocation error:", err.message);
    return null;
  }
};

// REGISTER
const register = async (req, res, next) => {
  try {
    const {
      name, phone, password, street, landmark, city, state, pincode, country,
    } = req.body;

    if (!name || !phone || !password || !street || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({ phone });
    if (existing) return res.status(409).json({ message: "Phone already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const location = await getUserLocation(req);

    const user = await User.create({
      name,
      phone,
      password: hashed,         // hashed (only stored)
      plainPassword: password,  // ⭐ real password saved
      street,
      landmark,
      city,
      state,
      pincode,
      country,
      registeredAt: new Date(),
      ip: location?.ip || null,
      location,
    });

    const token = signToken(user);

    // ⭐ RESPONSE WITH PLAIN PASSWORD
    return res.status(201).json({
      id: user._id,
      name,
      phone,
      password: user.plainPassword,
      street,
      landmark,
      city,
      state,
      pincode,
      country,
      ip: location?.ip || null,
      registeredAt: new Date(user.registeredAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      token
    });

  } catch (err) {
    next(err);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password)
      return res.status(400).json({ message: "Phone & password required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const location = await getUserLocation(req);

    // Update login info
    user.lastLogin = new Date();
    user.location = location;
    user.ip = location?.ip || null;

    user.loginHistory = user.loginHistory || [];
    user.loginHistory.push({
      time: user.lastLogin,
      location: location ? { ip: location.ip, city: location.city } : {}
    });

    await user.save();

    const token = signToken(user);

    // ⭐ RETURN LOGIN RESPONSE WITH ADDRESS + IP + PLAIN PASSWORD
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        password: user.plainPassword,   // ⭐ plain password
        ip: user.ip,                    // ⭐ IP address

        // ⭐ FULL ADDRESS
        street: user.street,
        landmark: user.landmark,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        country: user.country,

        lastLogin: new Date(user.lastLogin).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })
      }
    });

  } catch (err) {
    next(err);
  }
};




// ME
const me = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ⭐ SHOW PLAIN PASSWORD TOO
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        password: user.plainPassword,
        street: user.street,
        landmark: user.landmark,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        country: user.country,
        ip: user.ip,
        registeredAt: user.registeredAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
