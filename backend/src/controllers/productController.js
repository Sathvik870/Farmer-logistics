const db = require('../db'); 
const logger = require('../logger'); 

exports.getAllProducts = async (req, res) => {
  logger.info('[PRODUCT] Request received to fetch all products.');
  try {
    const { rows } = await db.query('SELECT * FROM products ORDER BY product_id DESC');
    logger.info(`[PRODUCT] Found ${rows.length} products. Processing images.`);
    const productsWithImages = rows.map(product => {
      if (product.product_image) {
        const imageUrl = `data:image/jpeg;base64,${product.product_image.toString('base64')}`;
        const { product_image, ...rest } = product;
        return { ...rest, imageUrl };
      }
      return product;
    });
    logger.info('[PRODUCT] Successfully fetched and processed all products.');
    res.status(200).json(productsWithImages);
  } catch (error) {
    logger.error(`[PRODUCT] Error fetching products: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, category, description, unit, price } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null; 
  if (!name || !category || !unit || !price) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }
  logger.info(`[PRODUCT] Attempting to create new product: '${name}'. Image attached: ${!!imageBuffer}`);
  try {

    const newProductQuery = `
      INSERT INTO products (name, category, description, unit, price,product_image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const { rows } = await db.query(newProductQuery, [name, category, description, unit, price,imageBuffer]);
    logger.info(`[PRODUCT] Successfully created product '${rows[0].name}' with ID: ${rows[0].product_id}.`);
    res.status(201).json(rows[0]);

  } catch (error) {
    logger.error(`[PRODUCT] Error creating product '${name}': ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, unit, price } = req.body;
  logger.info(`[PRODUCT] Attempting to update product with ID: ${id}.`);
  if (!name || !category || !unit || !price) {
    logger.warn(`[PRODUCT] Update failed for ID ${id}: Missing required fields.`);
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const updateQuery = `
      UPDATE products
      SET name = $1, category = $2, description = $3, unit = $4, price = $5, updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $6
      RETURNING *;
    `;
    
    const { rows } = await db.query(updateQuery, [name, category, description, unit, price, id]);

    if (rows.length === 0) {
      logger.warn(`[PRODUCT] Update failed: Product with ID ${id} not found.`);
      return res.status(404).json({ message: 'Product not found' });
    }
    logger.info(`[PRODUCT] Successfully updated product '${rows[0].name}' (ID: ${id}).`);
    res.status(200).json(rows[0]);
  } catch (error) {
    logger.error(`[PRODUCT] Error updating product with ID ${id}: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  logger.info(`[PRODUCT] Attempting to delete product with ID: ${id}.`);
  try {
    const deleteResult = await db.query('DELETE FROM products WHERE product_id = $1', [id]);
    
    if (deleteResult.rowCount === 0) {
      logger.warn(`[PRODUCT] Delete failed: Product with ID ${id} not found.`);
        return res.status(404).json({ message: 'Product not found' });
    }
    logger.info(`[PRODUCT] Successfully deleted product with ID: ${id}.`);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error(`[PRODUCT] Error deleting product with ID ${id}: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Internal server error' });
  }
};