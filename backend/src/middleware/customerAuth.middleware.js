const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const protectCustomer = (req, res, next) => {
  const token = req.cookies.customerAuthToken;

  if (!token) {
    logger.warn("[CUSTOMER_AUTH_MIDDLEWARE] Access denied: No token provided.");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.CUSTOMER_JWT_SECRET);

    if (decoded.role !== "customer") {
      logger.warn(
        `[CUSTOMER_AUTH_MIDDLEWARE] Access denied: Invalid token role ('${decoded.role}') provided.`
      );
      return res
        .status(401)
        .json({ message: "Not authorized, invalid token role" });
    }

    req.customer = decoded;

    logger.info(
      `[CUSTOMER_AUTH_MIDDLEWARE] Token verified for customer ID: ${decoded.customer_id}`
    );

    next();
  } catch (error) {
    logger.error(
      `[CUSTOMER_AUTH_MIDDLEWARE] Token verification failed: ${error.message}`
    );
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protectCustomer };
