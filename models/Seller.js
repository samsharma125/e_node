const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  // 🧍 Basic info
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🏬 Shop details
  shopName: { type: String, required: true },
  street: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: "India" },

  // 📅 Tracking
  registeredAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },

  // ⚙️ Seller role for separation
 
},{ timestamps: true } 
);

module.exports = mongoose.model("Seller", sellerSchema);
