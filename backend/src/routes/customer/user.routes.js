const express = require("express");
const router = express.Router();
const {
  getCustomerProfile,
  updateCustomerLocation
} = require("../../controllers/customer/user.controller");
const { protectCustomer } = require("../../middleware/customerAuth.middleware");

router.get("/profile", protectCustomer, getCustomerProfile);
router.put("/location", protectCustomer, updateCustomerLocation);

module.exports = router;
