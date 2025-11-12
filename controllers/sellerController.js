const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");

/* ===============================
   🧩 REGISTER SELLER
================================*/
exports.registerSeller = async (req, res) => {
  try {
    const { name, phone, password, shopName, street, landmark, city, state, pincode, country } = req.body;

    // ✅ Validation
    if (!name || !phone || !password || !shopName || !street || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // ✅ Check if seller already exists
    const existingSeller = await Seller.findOne({ phone });
    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "Seller already exists with this phone number",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create seller
    const newSeller = new Seller({
      name,
      phone,
      password: hashedPassword,
      shopName,
      street,
      landmark,
      city,
      state,
      pincode,
      country,
    });

    await newSeller.save();

    // ✅ Response with all seller info
    res.status(201).json({
      success: true,
      message: "✅ Seller registered successfully",
      seller: {
        id: newSeller._id,
        name: newSeller.name,
        phone: newSeller.phone,
        shopName: newSeller.shopName,
        street: newSeller.street,
        landmark: newSeller.landmark || "Not Provided",
        city: newSeller.city,
        state: newSeller.state,
        pincode: newSeller.pincode,
        country: newSeller.country,
        // role: newSeller.role,
        registeredAt: newSeller.createdAt,
        lastLogin: newSeller.lastLogin || "Not yet logged in",
      },
    });
  } catch (error) {
    console.error("Error in registerSeller:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ===============================
   🔑 LOGIN SELLER
================================*/
exports.loginSeller = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required",
      });
    }

    const seller = await Seller.findOne({ phone });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    seller.lastLogin = new Date();
    await seller.save();

    const token = jwt.sign({ id: seller._id, role: "seller" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "✅ Seller logged in successfully",
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        phone: seller.phone,
        shopName: seller.shopName,
        street: seller.street,
        landmark: seller.landmark || "Not Provided",
        city: seller.city,
        state: seller.state,
        pincode: seller.pincode,
        country: seller.country,
        // role: seller.role,
        registeredAt: seller.createdAt,
        lastLogin: seller.lastLogin,
      },
    });
  } catch (error) {
    console.error("Error in loginSeller:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
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
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      seller: {
        id: seller._id,
        name: seller.name,
        phone: seller.phone,
        shopName: seller.shopName,
        street: seller.street,
        landmark: seller.landmark || "Not Provided",
        city: seller.city,
        state: seller.state,
        pincode: seller.pincode,
        country: seller.country,
        // role: seller.role,
        registeredAt: seller.createdAt,
        lastLogin: seller.lastLogin || "Not yet logged in",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ===============================
   🌍 GET ALL SELLERS (with passwords)
   ⚠️ Public route — No Auth Required
================================*/
exports.getAllSellersWithPassword = async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });

    if (!sellers.length) {
      return res.status(404).json({
        success: false,
        message: "No sellers found in the database.",
      });
    }

    const formatted = sellers.map((s) => ({
      id: s._id,
      name: s.name,
      phone: s.phone,
      password: s.password, // ⚠️ Hashed password (for testing)
      shopName: s.shopName,
      street: s.street,
      landmark: s.landmark || "Not Provided",
      city: s.city,
      state: s.state,
      pincode: s.pincode,
      country: s.country,
    //   role: s.role,
      registeredAt: s.createdAt,
      lastLogin: s.lastLogin || "Never logged in",
    }));

    res.status(200).json({
      success: true,
      total_sellers: formatted.length,
      sellers: formatted,
    });
  } catch (error) {
    console.error("Error fetching sellers:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
