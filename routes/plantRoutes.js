const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant");

// ➕ Add a new plant
router.post("/", async (req, res) => {
  try {
    const plant = await Plant.create(req.body);
    res.status(201).json(plant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📋 Get all plants
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🌿 Get plants by categoryId (example: /api/plants/category/1)
router.get("/category/:categoryId", async (req, res) => {
  try {
    const plants = await Plant.find({ categoryId: req.params.categoryId });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
