const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Details
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plainPassword: { type: String },

    // Address
    label: { type: String },   // Home / Work / Other
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },

    // IP + Location
    ip: { type: String },
    location: { type: Object }, // stores city, region, lat/lon, etc.

    // Login activity
    lastLogin: { type: Date },

    // Registered Date
    registeredAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
