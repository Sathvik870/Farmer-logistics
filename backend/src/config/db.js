const { Pool } = require("pg");
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const caCertPath = path.resolve(__dirname, '../../', 'certs', 'ca.pem');

logger.info(`[DB] Attempting to read Aiven CA certificate from the root path`);

let caCertContent;
try {
    caCertContent = fs.readFileSync(caCertPath).toString();
    logger.info("[DB] Successfully read CA certificate file.");
} catch (error) {
    logger.error("[DB] !!! CRITICAL ERROR: FAILED TO READ ca.pem CERTIFICATE FILE !!!");
    logger.error(`[DB] Reason: ${error.message}`);
    process.exit(1); 
}

const sslConfig = {
  rejectUnauthorized: true, 
  ca: caCertContent,
};

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: sslConfig,
});

logger.info("[DB] Database pool created with SSL configuration");

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool,
};