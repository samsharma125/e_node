const mongoose = require("mongoose");

const sellerItemSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: "Plant", required: true },
  price: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SellerItem", sellerItemSchema);
          