const mongoose = require("mongoose");

/* 🌿 Plant schema inside a category */
const plantSchema = new mongoose.Schema(
  {
    plantId: { type: Number, required: true },
    plantName: { type: String, required: true },
    plantNameUrl: { type: String }, // slug or unique URL for frontend
    plantPhotoUrl: { type: String },
    description: { type: String },
  },
  { _id: false }
);

/* 🌳 Category schema */
const categorySchema = new mongoose.Schema(
  {
    categoryId: { type: Number, required: true, unique: true },
    categoryName: { type: String, required: true },
    plants: [plantSchema], // each category has many plants
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlantCategory", categorySchema);
