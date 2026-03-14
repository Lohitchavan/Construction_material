const User = require("../models/User");
const Order = require("../models/Order");

async function listUsers(_req, res, next) {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ items: users });
  } catch (err) {
    next(err);
  }
}

async function listAllOrders(_req, res, next) {
  try {
    const orders = await Order.find({})
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json({ items: orders });
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, listAllOrders };

