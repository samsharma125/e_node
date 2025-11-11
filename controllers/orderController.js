const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// compute totals
const computeTotals = (items) => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = 0;
  const shippingFee = 0;
  const total = subtotal + tax + shippingFee;
  return { subtotal, tax, shippingFee, total };
};

// Create order from cart
exports.createOrderFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    // Stock check
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
      }
    }

    // Build order items with seller
    const items = cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      seller: i.product.seller
    }));

    const { subtotal, tax, shippingFee, total } = computeTotals(items);

    const order = await Order.create({
      user: req.user.id,
      items,
      subtotal,
      tax,
      shippingFee,
      total,
      currency: "INR",
      status: "pending",
      shippingAddress: req.body.shippingAddress || {}
    });

    // Deduct stock
    for (const i of cart.items) {
      await Product.updateOne({ _id: i.product._id }, { $inc: { stock: -i.quantity } });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.listMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Seller: list orders containing their products
exports.listSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "items.seller": req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Admin: list all orders
exports.listAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Admin: update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};
