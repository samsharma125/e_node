const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  plant_name: {
    type: String,
    required: true,
    trim: true,
  },
  category_id: {
    type: Number,
    required: true,
  },
  plant_photo_url: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    required: true,
  },
  plant_id: {
    type: Number,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Plant", plantSchema);
