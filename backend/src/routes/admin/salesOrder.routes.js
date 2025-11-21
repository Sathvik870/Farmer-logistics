const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/adminAuth.middleware");
const { 
  getAllSalesOrders, 
  updateOrderStatus 
} = require("../../controllers/admin/salesOrder.controller");

router.get("/", protect, getAllSalesOrders);

router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;