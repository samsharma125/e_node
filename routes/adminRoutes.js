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
<<<<<<< HEAD
const { listUsersWithPasswords } = require("../controllers/adminController");

=======
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58

// Admin dashboard routes
router.get("/users", auth, adminOnly, listUsers);
router.put("/users/:id/role", auth, adminOnly, updateUserRole);

router.get("/products", auth, adminOnly, listAllProducts);
router.delete("/products/:slug", auth, adminOnly, removeProduct);

router.get("/orders", auth, adminOnly, listAllOrders);

<<<<<<< HEAD


=======
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
module.exports = router;
