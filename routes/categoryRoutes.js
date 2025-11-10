const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ Category Schema
const categorySchema = new mongoose.Schema({
  categoryId: { type: Number, required: true, unique: true },
  categoryName: { type: String, required: true },
  description: { type: String },
});

const Category = mongoose.model("Category", categorySchema);

// ➕ Add a new category
router.post("/", async (req, res) => {
  try {
    const { categoryId, categoryName, description } = req.body;

    if (!categoryId || !categoryName) {
      return res
        .status(400)
        .json({ success: false, message: "categoryId and categoryName are required" });
    }

    const existing = await Category.findOne({ categoryId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const newCategory = await Category.create({ categoryId, categoryName, description });
    res.status(201).json({
      success: true,
      message: "✅ Category added successfully",
      category: newCategory,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📋 Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      total: categories.length,
      categories,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔍 Get category by ID
router.get("/:categoryId", async (req, res) => {
  try {
    const category = await Category.findOne({ categoryId: req.params.categoryId });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ❌ Delete category by ID
router.delete("/:categoryId", async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ categoryId: req.params.categoryId });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      message: "🗑️ Category deleted successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
