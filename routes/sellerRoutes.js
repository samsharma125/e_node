const express = require("express");
const router = express.Router();
const {
  registerSeller,
  loginSeller,
  getSellerProfile,
  getAllSellersWithPassword
} = require("../controllers/sellerController");
const auth = require("../middleware/auth");

/* ===============================
   🧩 Seller Routes
================================*/
router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.get("/profile", auth, getSellerProfile);

// ✅ Public route (no auth): get all sellers with hashed passwords
router.get("/all", getAllSellersWithPassword);

module.exports = router;
