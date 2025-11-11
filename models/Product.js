const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    images: [{ type: String }], // store relative URLs like /uploads/filename.jpg
    category: { type: String, index: true },
    brand: { type: String },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    attributes: [{ key: String, value: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
