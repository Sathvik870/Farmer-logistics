const express = require("express");
const router = express.Router();
const { batchUpdateStock } = require("../controllers/stock.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.put("/batch-update", batchUpdateStock);

module.exports = router;