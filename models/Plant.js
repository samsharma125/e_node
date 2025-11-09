const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  plantId: { type: Number, required: true, unique: true },
  categoryId: { type: Number, required: true, ref: "Category" },
  plantName: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }
});

module.exports = mongoose.model("Plant", plantSchema);
