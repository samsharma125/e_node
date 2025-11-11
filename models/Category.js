const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: { type: String, required: true, trim: true },
  category_id: { type: Number, required: true, unique: true }
});

module.exports = mongoose.model("Category", categorySchema);
