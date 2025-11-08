const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} = require("../controllers/cartController");

router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.post("/update", auth, updateQuantity);
router.post("/remove", auth, removeFromCart);
router.post("/clear", auth, clearCart);

module.exports = router;
