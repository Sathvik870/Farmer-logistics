const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const protect = (req, res, next) => {
  try {
    const token = req.cookies.adminAuthToken;
    logger.info(`[AUTH_MIDDLEWARE] Checking for admin auth token in cookies.`);
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        req.user = decoded;
        next();
        logger.info(
          `[AUTH_MIDDLEWARE] Token verified successfully for user: ${decoded.username}`
        );
      } catch (error) {
        logger.error(
          `[AUTH_MIDDLEWARE] Token verification failed: ${error.message}`
        );
        return res
          .status(401)
          .json({ message: "Not authorized, token failed" });
      }
    } else {
      logger.warn(
        "[AUTH_MIDDLEWARE] Access denied: No token provided in cookies."
      );
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    logger.error(`[AUTH_MIDDLEWARE] Server error: ${error.message}`);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { protect };
