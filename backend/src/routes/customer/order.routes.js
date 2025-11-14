const express = require("express");
const router = express.Router();
const { placeOrder, getOrderSummary, getInvoicePDF, getInvoicesForDate } = require("../../controllers/customer/order.controller");
const { protectCustomer } = require("../../middleware/customerAuth.middleware");

router.post("/", protectCustomer, placeOrder);
router.get("/summary", protectCustomer, getOrderSummary);
router.get("/by-date/:date", protectCustomer, getInvoicesForDate);
router.get("/:invoiceCode/pdf", protectCustomer, getInvoicePDF);

module.exports = router;