const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  registerSeller,
  loginSeller,
  getSellerProfile,
  getAllSellersWithPassword,
  addSellerProduct,
  getSellerProducts,
  getRandomSellerProducts,
} = require("../controllers/sellerController");

/* ===============================
   🧩 Seller Authentication Routes
================================*/
router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.get("/profile", auth, getSellerProfile); // use auth middleware for protection

/* ===============================
   🌍 Seller Management Routes
================================*/
router.get("/all", getAllSellersWithPassword); // public route for testing

/* ===============================
   🪴 Seller Product Management Routes
================================*/
router.post("/add-product", addSellerProduct);
router.get("/my-products/:sellerId", getSellerProducts);
router.get("/random-products", getRandomSellerProducts);

module.exports = router;
