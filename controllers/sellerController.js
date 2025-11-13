const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");
const SellerItem = require("../models/SellerItem");
const Plant = require("../models/Plant");

/* ===============================
   🧩 REGISTER SELLER
================================*/
exports.registerSeller = async (req, res) => {
  try {
    const { name, phone, password, shopName, street, landmark, city, state, pincode, country } = req.body;

    if (!name || !phone || !password || !shopName || !street || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingSeller = await Seller.findOne({ phone });
    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "Seller already exists with this phone number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
        registeredAt: newSeller.createdAt,
        
      },
    });
  } catch (error) {
    console.error("Error in registerSeller:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/* ===============================
   🔑 LOGIN SELLER
================================*/
exports.loginSeller = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: "Phone and password are required" });
    }

    const seller = await Seller.findOne({ phone });
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    seller.lastLogin = new Date();
    await seller.save();

    const token = jwt.sign({ id: seller._id, role: "seller" }, process.env.JWT_SECRET, { expiresIn: "7d" });

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
        registeredAt: seller.createdAt,
     
      },
    });
  } catch (error) {
    console.error("Error in loginSeller:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/* ===============================
   👤 GET SELLER PROFILE
================================*/
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select("-password");
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/* ===============================
   🌍 GET ALL SELLERS (with passwords)
================================*/
exports.getAllSellersWithPassword = async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    if (!sellers.length) {
      return res.status(404).json({ success: false, message: "No sellers found." });
    }

    const formatted = sellers.map((s) => ({
      id: s._id,
      name: s.name,
      phone: s.phone,
      password: s.password, // ⚠️ Hashed password (testing)
      shopName: s.shopName,
      city: s.city,
      state: s.state,
      country: s.country,
      registeredAt: s.createdAt,
    
    }));

    res.status(200).json({ success: true, total_sellers: formatted.length, sellers: formatted });
  } catch (error) {
    console.error("Error fetching sellers:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/* ===============================
   🪴 SELLER PRODUCT MANAGEMENT
================================*/

/* ➕ ADD PRODUCT TO SELLER'S LIST */
exports.addSellerProduct = async (req, res) => {
  try {
    const { sellerId, plantId, price } = req.body;

    if (!sellerId || !plantId || !price) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const item = new SellerItem({ sellerId, plantId, price });
    await item.save();

    res.status(201).json({ success: true, message: "✅ Product added successfully", item });
  } catch (error) {
    console.error("Error in addSellerProduct:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/* 👀 GET ALL PRODUCTS OF A SELLER (with photo + category) */
exports.getSellerProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const products = await SellerItem.find({ sellerId })
      .populate({
        path: "plantId",
        select: "plant_name plant_photo_url category_id description",
        populate: { path: "category_id", model: "Category", select: "category_name" },
      })
      .populate({ path: "sellerId", select: "shopName city" })
      .sort({ addedAt: -1 });

    if (!products.length) {
      return res.status(404).json({ success: false, message: "No products found for this seller." });
    }

    const formatted = products.map((item) => ({
      id: item._id,
      price: item.price,
      plant: {
        name: item.plantId?.plant_name || "Unknown Plant",
        photo: item.plantId?.plant_photo_url || "",
        category: item.plantId?.category_id?.category_name || "N/A",
        description: item.plantId?.description || "",
      },
      seller: {
        shopName: item.sellerId?.shopName || "Unknown Seller",
        city: item.sellerId?.city || "N/A",
      },
    }));

    res.status(200).json({ success: true, total_products: formatted.length, products: formatted });
  } catch (error) {
    console.error("Error in getSellerProducts:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/* 🎲 RANDOM SELLER PRODUCTS FOR HOMEPAGE (with photo + category) */
exports.getRandomSellerProducts = async (req, res) => {
  try {
    const items = await SellerItem.aggregate([{ $sample: { size: 8 } }]);
    const populated = await SellerItem.populate(items, [
      { path: "plantId", select: "plant_name plant_photo_url category_id", populate: { path: "category_id", select: "category_name" } },
      { path: "sellerId", select: "shopName city" },
    ]);

    res.status(200).json({ success: true, random_products: populated });
  } catch (error) {
    console.error("Error in getRandomSellerProducts:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
