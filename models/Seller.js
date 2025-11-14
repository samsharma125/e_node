const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plainPassword: { type: String },

    // Address
    shopName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },

    // Location
    ip: { type: String },
    location: { type: Object },

    // Tracking
    registeredAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
  },
  { timestamps: true,
    
   },
  
);

module.exports = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);
