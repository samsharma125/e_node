const jwt = require("jsonwebtoken");
<<<<<<< HEAD

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = auth;
=======
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const header = req.header("Authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user with role
    const user = await User.findById(decoded.id).select("id name role phone");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach full user info
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
>>>>>>> d99070ccc3993fe79b28bacbe1fe247f9696fb58
