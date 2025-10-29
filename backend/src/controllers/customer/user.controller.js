const db = require("../../config/db");
const logger = require("../../config/logger");

exports.getCustomerProfile = async (req, res) => {
  const customer_id = req.customer.customer_id;
  
  logger.info(`[CUSTOMER] Attempting to fetch profile for customer ID: ${customer_id}`);
  
  try {
    const query = `
        SELECT 
            customer_id,
            customer_code,
            username,
            gender,
            first_name,
            last_name,
            email,
            phone_number,
            address,
            city,
            state
        FROM customers 
        WHERE customer_id = $1
    `;
    
    const { rows } = await db.query(query, [customer_id]);

    if (rows.length === 0) {
      logger.warn(`[CUSTOMER] Profile not found for customer ID: ${customer_id} despite valid token.`);
      return res.status(404).json({ message: "Customer profile not found." });
    }

    res.status(200).json(rows[0]);

  } catch (error) {
    logger.error(`[CUSTOMER] Error fetching profile for customer ID ${customer_id}: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
