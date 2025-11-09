const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // 🧩 Basic user info
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🏠 Optional addresses
  addresses: { type: Array, default: [] },

  // 🌍 Location info (updated on registration/login)
  location: {
    ip: String,
    city: String,
    region: String,
    country: String,
    latitude: Number,
    longitude: Number,
    timezone: String,
    lastUpdated: Date,
  },

  // 📅 Time tracking
  registeredAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },

  // 🧠 Login history
  loginHistory: [
    {
      time: { type: Date, default: Date.now },
      location: {
        ip: String,
        city: String,
        country: String,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
