const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  list, get, create, update, remove, uploadImage
} = require("../controllers/productController");
const upload = require("../middleware/upload");

// Public
router.get("/", list);
router.get("/:slug", get);

// Image upload (authenticated)
router.post("/upload", auth, upload.single("image"), uploadImage);

// Marketplace: any authenticated user can create products
router.post("/", auth, create);

// Update/remove product (only seller or admin)
router.put("/:slug", auth, update);
router.delete("/:slug", auth, remove);

module.exports = router;
