const express = require("express");
const router = express.Router();
const {
  getCustomerProfile,
} = require("../../controllers/customer/user.controller");
const { protectCustomer } = require("../../middleware/customerAuth.middleware");

router.get("/profile", protectCustomer, getCustomerProfile);

module.exports = router;
