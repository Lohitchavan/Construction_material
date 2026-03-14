const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { listUsers, listAllOrders } = require("../controllers/admin.controller");
const { updateOrderStatus } = require("../controllers/order.controller");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/users", listUsers);
router.get("/orders", listAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;

