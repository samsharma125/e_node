const express = require("express");
const router = express.Router();
const { protect, sellerOnly } = require("../middleware/auth");
const { addProduct, getSellerProducts } = require("../controllers/sellerController");

router.post("/products", protect, sellerOnly, addProduct);
router.get("/products", protect, sellerOnly, getSellerProducts);

module.exports = router;
