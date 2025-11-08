const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createOrderFromCart,
  listMyOrders,
  listSellerOrders,
  listAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const adminOnly = require("../middleware/admin");

router.post("/", auth, createOrderFromCart);
router.get("/mine", auth, listMyOrders);
router.get("/seller", auth, listSellerOrders); // seller view of orders
router.get("/", auth, adminOnly, listAllOrders);
router.put("/:id/status", auth, adminOnly, updateOrderStatus);

module.exports = router;
