const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");
const SellerItem = require("../models/SellerItem");
const axios = require("axios");

// Get Seller IP + Location
const getSellerLocation = async (req) => {
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


/* ===============================
   🧩 REGISTER SELLER
================================*/
exports.registerSeller = async (req, res) => {
  try {
    const { name, phone, password, shopName, line1, line2, city, state, pincode, country } = req.body;

    if (!name || !phone || !password || !shopName || !line1 || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    const existingSeller = await Seller.findOne({ phone });
    if (existingSeller) {
      return res.status(400).json({ success: false, message: "Seller already exists with this phone number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = new Seller({
      name,
      phone,
      password: hashedPassword,
      plainPassword: password,
      shopName,
      line1,
      line2,
      city,
      state,
      pincode,
      country,
      ip: req.ip, // only save ip
      registeredAt: new Date(),
    });

    await newSeller.save();

    const token = jwt.sign(
      { id: newSeller._id, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      token,
      id: newSeller._id,
      name: newSeller.name,
      phone: newSeller.phone,
      shopName: newSeller.shopName,
      line1: newSeller.line1,
      line2: newSeller.line2,
      city: newSeller.city,
      state: newSeller.state,
      pincode: newSeller.pincode,
      country: newSeller.country,
      ip: newSeller.ip,
      registeredAt: newSeller.registeredAt,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


/* ===============================
   🔐 LOGIN SELLER
================================*/
exports.loginSeller = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: "Phone and password are required" });
    }

    const seller = await Seller.findOne({ phone });
    if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

   
   
    seller.ip = req.ip;
    seller.lastLogin = new Date();
    await seller.save();
    

    const token = jwt.sign({ id: seller._id, role: "seller" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Seller logged in successfully",
      token,
      id: seller._id,
      name: seller.name,
      phone: seller.phone,
      shopName: seller.shopName,
      line1: seller.line1,
      line2: seller.line2,
      city: seller.city,
      state: seller.state,
      pincode: seller.pincode,
      country: seller.country,
      ip: seller.ip,
      registeredAt: seller.registeredAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


/* ===============================
   🔥 GET ALL LOGGED-IN SELLERS
================================*/
exports.getLoggedInSellers = async (req, res) => {
  try {
    const sellers = await Seller.find(
      { lastLogin: { $exists: true, $ne: null } },
      "name phone shopName city state pincode country ip lastLogin"
    ).sort({ lastLogin: -1 });

    if (!sellers.length) {
      return res.status(404).json({
        success: false,
        message: "No sellers have logged in yet.",
      });
    }

    const formatted = sellers.map((seller) => {
      const token = jwt.sign(
        { id: seller._id, role: "seller" },
        process.env.JWT_SECRET || "dev_secret",
        { expiresIn: "7d" }
      );

      return {
        id: seller._id,
        token,
        name: seller.name,
        phone: seller.phone,
        shopName: seller.shopName,
        city: seller.city,
        state: seller.state,
        pincode: seller.pincode,
        country: seller.country,
        ip: seller.ip || "Not Available",
        lastLogin: new Date(seller.lastLogin).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      };
    });

    return res.status(200).json({
      success: true,
      total_logged_in_sellers: formatted.length,
      logged_in_sellers: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


/* ===============================
   👤 GET SELLER PROFILE
================================*/
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select("-password");
    if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


/* ===============================
   📋 GET ALL SELLERS (Testing)
================================*/
exports.getAllSellersWithPassword = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json({ success: true, count: sellers.length, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


/* ===============================
   🪴 ADD SELLER PRODUCT
================================*/
exports.addSellerProduct = async (req, res) => {
  try {
    const { sellerId, plantId, price } = req.body;
    if (!sellerId || !plantId || !price) {
      return res.status(400).json({ success: false, message: "sellerId, plantId and price are required" });
    }

    const newItem = new SellerItem({ sellerId, plantId, price });
    await newItem.save();

    res.status(201).json({ success: true, message: "Product added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


/* ===============================
   📦 GET SELLER PRODUCTS
================================*/
exports.getSellerProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const items = await SellerItem.find({ sellerId }).populate("plantId");
    res.status(200).json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


/* ===============================
   🎲 GET RANDOM SELLER PRODUCTS
================================*/
exports.getRandomSellerProducts = async (req, res) => {
  try {
    const items = await SellerItem.aggregate([{ $sample: { size: 5 } }]);
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
