const express = require("express");
const router = express.Router();
const { subscribeAdmin } = require("../../utils/common/pushService");
const { protect } = require("../../middleware/adminAuth.middleware");

router.post("/subscribe", protect, async (req, res) => {
  await subscribeAdmin(req.body);
  res.status(201).json({ message: "Subscribed for notifications" });
});

module.exports = router;