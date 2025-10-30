const db = require("../../config/db");
const logger = require("../../config/logger");

exports.getSaleableProducts = async (req, res) => {
  logger.info("[PUBLIC_PRODUCT] Attempting to fetch all saleable products.");

  try {
    const query = `
      SELECT 
        p.product_id, p.product_code, p.product_name, p.product_category,
        p.product_description, p.unit_type, p.cost_price, p.selling_price,
        p.sell_per_unit_qty, p.selling_unit, p.product_image,
        s.saleable_quantity
      FROM 
        products p
      JOIN 
        stocks s ON p.product_id = s.product_id
      WHERE 
        s.saleable_quantity > 0
      ORDER BY 
        p.product_name ASC;
    `;
    const { rows } = await db.query(query);

    const productsWithImages = rows.map(product => {
      let imageUrl = null;
      if (product.product_image) {
        imageUrl = `data:image/jpeg;base64,${product.product_image.toString("base64")}`;
      }
      const { product_image, ...productData } = product;
      return { ...productData, imageUrl };
    });

    res.status(200).json(productsWithImages);
  } catch (error) {
    logger.error(`[PUBLIC_PRODUCT] Error fetching saleable products: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};