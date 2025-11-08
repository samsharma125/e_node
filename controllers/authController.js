const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res, next) => {
  try {
    const { name, phone, password, role, addresses } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) return res.status(409).json({ message: "Phone already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      phone,
      password: hashed,
      role: role || "user",
      addresses: addresses || [],
      registeredAt: new Date()   // <-- auto timestamp
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        registeredAt: user.registeredAt
      }
    });
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
  } catch (err) {
    next(err);
  }
};


exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};
