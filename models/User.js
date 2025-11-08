const mongoose = require("mongoose");

// Address sub-schema (unchanged)
const addressSchema = new mongoose.Schema(
  {
    label: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  { _id: false }
);

// ✅ Add location sub-schema (NEW)
const locationSchema = new mongoose.Schema(
  {
    ip: String,
    city: String,
    region: String,
    country: String,
    latitude: Number,
    longitude: Number,
    timezone: String,
    lastUpdated: { type: Date, default: Date.now }
  },
  { _id: false }
);

// ✅ Main User schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addresses: [addressSchema],
    location: locationSchema, // ✅ added field for storing location info
    registeredAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
