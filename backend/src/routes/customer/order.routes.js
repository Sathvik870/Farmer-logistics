const express = require("express");
const router = express.Router();
const { placeOrder } = require("../../controllers/customer/order.controller");
const { protectCustomer } = require("../../middleware/customerAuth.middleware");

router.post("/", protectCustomer, placeOrder);

module.exports = router;