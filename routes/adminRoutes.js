const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const {
  listUsers,
  updateUserRole,
  listAllProducts,
  removeProduct,
  listAllOrders
} = require("../controllers/adminController");
const { listUsersWithPasswords } = require("../controllers/adminController");


// Admin dashboard routes
router.get("/users", auth, adminOnly, listUsers);
router.put("/users/:id/role", auth, adminOnly, updateUserRole);

router.get("/products", auth, adminOnly, listAllProducts);
router.delete("/products/:slug", auth, adminOnly, removeProduct);

router.get("/orders", auth, adminOnly, listAllOrders);



module.exports = router;
