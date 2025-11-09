const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { register, login, me } = require("../controllers/authController");

// ✅ POST routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);

// ✅ GET register route (works fully like POST)
router.get("/register", async (req, res, next) => {
  try {
    let { name, phone, password, addresses } = req.query;

    if (addresses) addresses = decodeURIComponent(addresses);

    let parsedAddresses = [];
    if (addresses) {
      try {
        parsedAddresses = JSON.parse(addresses);
      } catch {
        parsedAddresses = [{ label: addresses }];
      }
    }

    req.body = { name, phone, password, addresses: parsedAddresses };
    return await register(req, res, next);
  } catch (err) {
    next(err);
  }
});

// ✅ GET login route (now supports `name` too)
router.get("/login", async (req, res, next) => {
  try {
    const { phone, password, name } = req.query;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    // ✅ Simulate a body just like POST
    req.body = { phone, password, name };

    // ✅ Call same login logic from controller
    return await login(req, res, next);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
