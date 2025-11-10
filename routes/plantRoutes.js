const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant");

// ➕ Add a new plant
router.post("/", async (req, res) => {
  try {
    const { plantId, categoryId, plantName, description, imageUrl } = req.body;

    if (!plantId || !categoryId || !plantName) {
      return res.status(400).json({
        success: false,
        message: "plantId, categoryId, and plantName are required",
      });
    }

    const existingPlant = await Plant.findOne({ plantId });
    if (existingPlant) {
      return res
        .status(400)
        .json({ success: false, message: "Plant with this plantId already exists" });
    }

    const plant = new Plant({
      plantId,
      categoryId,
      plantName,
      description,
      imageUrl,
    });

    await plant.save();

    res.status(201).json({
      success: true,
      message: "✅ Plant added successfully",
      plant,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📋 Get all plants
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json({
      success: true,
      total: plants.length,
      plants,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔍 Get plant by ID
router.get("/:plantId", async (req, res) => {
  try {
    const plant = await Plant.findOne({ plantId: req.params.plantId });
    if (!plant) {
      return res.status(404).json({ success: false, message: "Plant not found" });
    }
    res.status(200).json({ success: true, plant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✏️ Update a plant
router.put("/:plantId", async (req, res) => {
  try {
    const updatedPlant = await Plant.findOneAndUpdate(
      { plantId: req.params.plantId },
      req.body,
      { new: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({ success: false, message: "Plant not found" });
    }

    res.status(200).json({
      success: true,
      message: "✅ Plant updated successfully",
      plant: updatedPlant,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ❌ Delete a plant
router.delete("/:plantId", async (req, res) => {
  try {
    const deletedPlant = await Plant.findOneAndDelete({ plantId: req.params.plantId });
    if (!deletedPlant) {
      return res.status(404).json({ success: false, message: "Plant not found" });
    }

    res.status(200).json({
      success: true,
      message: "🗑️ Plant deleted successfully",
      plant: deletedPlant,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
