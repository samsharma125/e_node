const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plainPassword: { type: String }, // for localhost (optional)

    // Address (FINAL FIELDS)
    label: { type: String, required: true },     // Home / Office
    line1: { type: String, required: true },     // Main address line
    line2: { type: String },                     // Optional
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },

    // Tracking
    registeredAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },

    // IP and location
    ip: { type: String },
    location: { type: Object },

    loginHistory: { type: Array }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
