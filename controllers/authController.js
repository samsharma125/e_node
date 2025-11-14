// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// JWT signer
const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "15d",
  });

// Get location/IP
const getUserLocation = async (req) => {
  try {
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

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
  } catch {
    return null;
  }
};

/* ============================================================
   REGISTER (returns ALL fields separately)
============================================================ */
const register = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      password,
      label,
      line1,
      line2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    if (
      !name ||
      !phone ||
      !password ||
      !label ||
      !line1 ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existing = await User.findOne({ phone });
    if (existing)
      return res.status(409).json({ message: "Phone already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const location = await getUserLocation(req);
    const ipAddress = location?.ip || null;

    const user = await User.create({
      name,
      phone,
      password: hashed,
      plainPassword: password,
      label,
      line1,
      line2,
      city,
      state,
      pincode,
      country: country || "India",
      registeredAt: new Date(),
      ip: ipAddress,
      location,
    });

    const token = signToken(user);

    // 🔥 ALL FIELDS SEPARATE (FLAT RESPONSE)
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,

      id: user._id,
      name: user.name,
      phone: user.phone,
      password: user.plainPassword,

      // Address
      label: user.label,
      line1: user.line1,
      line2: user.line2,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      country: user.country,

      ip: user.ip,
     
      registeredAt: user.registeredAt,
    });
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   LOGIN (returns ALL fields separately)
============================================================ */
const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password)
      return res
        .status(400)
        .json({ message: "Phone & password required" });

    const user = await User.findOne({ phone });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });



  
   
    user.ip = location?.ip || null;

    await user.save();

    const token = signToken(user);

    // 🔥 FLAT LOGIN RESPONSE
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      id: user._id,
      name: user.name,
      phone: user.phone,
      password: user.plainPassword,
      ip: user.ip,

      label: user.label,
      line1: user.line1,
      line2: user.line2,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      country: user.country,

      lastLogin: new Date(user.lastLogin).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    });
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   ME (returns ALL fields separately)
============================================================ */
const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      success: true,

      id: user._id,
      name: user.name,
      phone: user.phone,
      password: user.plainPassword,

      label: user.label,
      line1: user.line1,
      line2: user.line2,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      country: user.country,

      ip: user.ip,
      registeredAt: user.registeredAt,
      lastLogin: user.lastLogin,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
