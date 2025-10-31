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
            latitude,
            longitude,
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


exports.updateCustomerLocation = async (req, res) => {
  const customer_id = req.customer.customer_id;
  const { address, city, state, lat, lng } = req.body;

  logger.info(`[CUSTOMER] Attempting to update location for customer ID: ${customer_id}`);

  if (!address) {
    return res.status(400).json({ message: "Address field is required." });
  }

  try {
    const updateQuery = `
      UPDATE customers
      SET 
        address = $1,
        city = $2,
        state = $3,
        latitude = $4, 
        longitude = $5
      WHERE 
        customer_id = $6 -- The customer_id should be the 6th parameter
      RETURNING customer_id, address, city, state, latitude, longitude;
    `;

    const { rows } = await db.query(updateQuery, [
      address || null,
      city || null,
      state || null,
      lat,
      lng,
      customer_id
    ]);

    if (rows.length === 0) {
      logger.warn(`[CUSTOMER] Update location failed: Customer ID ${customer_id} not found.`);
      return res.status(404).json({ message: "Customer not found." });
    }

    logger.info(`[CUSTOMER] Successfully updated location for customer ID: ${customer_id}`);
    res.status(200).json({
      message: "Location updated successfully!",
      location: rows[0],
    });

  } catch (error) {
    logger.error(`[CUSTOMER] Error updating location for customer ID ${customer_id}: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};