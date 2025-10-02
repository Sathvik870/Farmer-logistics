const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const protect = (req, res, next) => {
  const token = req.cookies.authToken;
  logger.info(`[AUTH_MIDDLEWARE] Checking for auth token in cookies.`);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
      logger.info(`[AUTH_MIDDLEWARE] Token verified successfully for user: ${decoded.username}`);
    } catch (error) {
      logger.error(`[AUTH_MIDDLEWARE] Token verification failed: ${error.message}`);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    logger.warn('[AUTH_MIDDLEWARE] Access denied: No token provided in cookies.');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };