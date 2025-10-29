const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  googleAuthSignupOrLogin,
  googleAuthLoginOnly,
} = require("../../controllers/customer/auth.controller");

router.post("/signup", signup);
router.post("/login", login);

router.post("/google-signup", googleAuthSignupOrLogin);
router.post("/google-login", googleAuthLoginOnly);

module.exports = router;
