const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { createOrder, myOrders, getMyOrder } = require("../controllers/order.controller");

const router = express.Router();

router.post("/", requireAuth, createOrder);
router.get("/mine", requireAuth, myOrders);
router.get("/mine/:id", requireAuth, getMyOrder);

module.exports = router;

