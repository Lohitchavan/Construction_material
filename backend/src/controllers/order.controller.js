const Order = require("../models/Order");
const Product = require("../models/Product");

async function createOrder(req, res, next) {
  try {
    const { items, address, paymentMethod } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }
    if (!address) return res.status(400).json({ message: "Address is required" });

    // Validate products & compute totals server-side
    const ids = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids } });
    const byId = new Map(products.map((p) => [p._id.toString(), p]));

    const normalized = [];
    let totalPrice = 0;

    for (const line of items) {
      const p = byId.get(String(line.productId));
      const qty = Math.max(1, parseInt(line.qty, 10) || 1);
      if (!p) return res.status(400).json({ message: "Invalid product in cart" });
      if (p.stock < qty) return res.status(400).json({ message: `Insufficient stock for ${p.name}` });

      normalized.push({
        product: p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        qty,
      });
      totalPrice += p.price * qty;
    }

    // Decrement stock
    for (const line of normalized) {
      await Product.updateOne({ _id: line.product }, { $inc: { stock: -line.qty } });
    }

    const order = await Order.create({
      user: req.user._id,
      items: normalized,
      totalPrice,
      status: "placed",
      address,
      paymentMethod: paymentMethod || "cod",
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ items: orders });
  } catch (err) {
    next(err);
  }
}

async function getMyOrder(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

// Admin
async function listOrders(req, res, next) {
  try {
    const orders = await Order.find({})
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json({ items: orders });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body || {};
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, myOrders, getMyOrder, listOrders, updateOrderStatus };

