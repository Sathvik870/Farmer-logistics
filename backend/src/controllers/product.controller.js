const db = require("../config/db");
const logger = require("../config/logger");

exports.getAllProducts = async (req, res) => {
  logger.info("[PRODUCT] Request received to fetch all products.");
  try {
    const query = `
      SELECT 
        p.product_id, 
        p.product_code, 
        p.name, 
        p.category, 
        COALESCE(p.description, 'N/A') as description,
        p.unit, 
        p.price,
        COALESCE(s.available_quantity, 0) as available_quantity
      FROM 
        products p
      LEFT JOIN 
        stocks s ON p.product_id = s.product_id
      ORDER BY 
        p.product_id DESC;
    `;
    const { rows } = await db.query(query);
    logger.info(
      `[PRODUCT] Successfully fetched ${rows.length} products without image data.`
    );
    res.status(200).json(rows);
  } catch (error) {
    logger.error(`[PRODUCT] Error fetching products: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createProduct = async (req, res) => {
  const { name, category, description, unit, price } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;
  if (!name || !category || !unit || !price) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }
  logger.info(
    `[PRODUCT] Attempting to create new product: '${name}'. Image attached: ${!!imageBuffer}`
  );
  try {
    const newProductQuery = `
      INSERT INTO products (name, category, description, unit, price,product_image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const { rows } = await db.query(newProductQuery, [
      name,
      category,
      description,
      unit,
      price,
      imageBuffer,
    ]);
    const { product_image, ...productData } = rows[0]; 
    logger.info(
      `[PRODUCT] Successfully created product '${productData.name}' with ID: ${productData.product_id}.`
    );
    res.status(201).json(productData);
  } catch (error) {
    logger.error(
      `[PRODUCT] Error creating product '${name}': ${error.message}`,
      { stack: error.stack }
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, unit, price } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;
  
  logger.info(`[PRODUCT] Attempting to update product ID: ${id}. New image provided: ${!!imageBuffer}`);
  if (!name || !category || !unit || !price) {
    logger.warn(`[PRODUCT] Update failed for ID ${id}: Missing required fields.`);
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    let updateQuery;
    let queryParams;
    if (imageBuffer) {
      updateQuery = `
        UPDATE products
        SET name = $1, category = $2, description = $3, unit = $4, price = $5, product_image = $6, updated_at = CURRENT_TIMESTAMP
        WHERE product_id = $7
        RETURNING *;
      `;
      queryParams = [name, category, description, unit, price, imageBuffer, id];
    } else {
      updateQuery = `
        UPDATE products
        SET name = $1, category = $2, description = $3, unit = $4, price = $5, updated_at = CURRENT_TIMESTAMP
        WHERE product_id = $6
        RETURNING *;
      `;
      queryParams = [name, category, description, unit, price, id];
    }

    const { rows } = await db.query(updateQuery, queryParams);

    if (rows.length === 0) {
      logger.warn(`[PRODUCT] Update failed: Product with ID ${id} not found.`);
      return res.status(404).json({ message: "Product not found" });
    }
    const { product_image, ...productData } = rows[0];

    logger.info(`[PRODUCT] Successfully updated product '${productData.name}' (ID: ${id}).`);
    res.status(200).json(productData);

  } catch (error) {
    logger.error(`[PRODUCT] Error updating product with ID ${id}: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  logger.info(`[PRODUCT] Attempting to delete product with ID: ${id}.`);
  try {
    const deleteResult = await db.query(
      "DELETE FROM products WHERE product_id = $1",
      [id]
    );

    if (deleteResult.rowCount === 0) {
      logger.warn(`[PRODUCT] Delete failed: Product with ID ${id} not found.`);
      return res.status(404).json({ message: "Product not found" });
    }
    logger.info(`[PRODUCT] Successfully deleted product with ID: ${id}.`);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error(
      `[PRODUCT] Error deleting product with ID ${id}: ${error.message}`,
      { stack: error.stack }
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  logger.info(
    `[PRODUCT] Request received to fetch full details for product ID: ${id}.`
  );

  try {
    const query = `
      SELECT 
        p.product_id, p.product_code, p.name, p.category, p.description, 
        p.unit, p.price, p.product_image,
        COALESCE(s.available_quantity, 0) as available_quantity
      FROM 
        products p
      LEFT JOIN 
        stocks s ON p.product_id = s.product_id
      WHERE 
        p.product_id = $1;
    `;
    const { rows } = await db.query(query, [id]);

    if (rows.length === 0) {
      logger.warn(
        `[PRODUCT] Full details request failed: Product with ID ${id} not found.`
      );
      return res.status(404).json({ message: "Product not found" });
    }

    const product = rows[0];
    let imageUrl = null;
    if (product.product_image) {
      imageUrl = `data:image/jpeg;base64,${product.product_image.toString(
        "base64"
      )}`;
    }
    const { product_image, ...productData } = product;
    const responsePayload = { ...productData, imageUrl };

    logger.info(
      `[PRODUCT] Successfully fetched full details for product ID: ${id}.`
    );
    res.status(200).json(responsePayload);
  } catch (error) {
    logger.error(
      `[PRODUCT] Error fetching full details for product ID ${id}: ${error.message}`,
      { stack: error.stack }
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
