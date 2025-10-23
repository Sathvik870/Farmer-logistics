const db = require("../config/db");
const logger = require("../config/logger");

exports.getAllPurchaseOrders = async (req, res) => {
  logger.info("[PO] Attempting to fetch all purchase orders.");

  try {
    const query = `
            SELECT 
                po.purchase_id,
                po.purchase_code,
                po.supplier_name,
                po.supplier_contact,
                po.purchase_date,
                SUM(poi.quantity * poi.price) AS total_amount
            FROM purchase_orders po
            JOIN purchase_order_items poi ON po.purchase_id = poi.purchase_id
            GROUP BY po.purchase_id, po.purchase_code, po.supplier_name, po.supplier_contact, po.purchase_date
            ORDER BY po.purchase_date DESC;
        `;
    const { rows } = await db.query(query);

    logger.info(`[PO] Found ${rows.length} existing purchase orders.`);
    res.status(200).json(rows);
  } catch (error) {
    logger.error(`[PO] Error fetching all purchase orders: ${error.message}`);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getPurchaseOrderDetails = async (req, res) => {
  const { id } = req.params;
  logger.info(`[PO] Attempting to fetch items for Purchase Order ID: ${id}`);
  try {
    const query = `
            SELECT
                poi.item_id,
                poi.product_id,
                poi.quantity,
                poi.price as purchase_price,
                p.product_code,
                p.name as product_name,
                p.category,
                p.unit
            FROM purchase_order_items poi -- <-- Correct table must be used here
            JOIN products p ON poi.product_id = p.product_id
            WHERE poi.purchase_id = $1;
        `;
    const { rows } = await db.query(query, [id]);
    res.status(200).json(rows);
  } catch (error) {
    logger.error(`[PO] Error fetching items for PO ${id}: ${error.message}`);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.createPurchaseOrder = async (req, res) => {
  logger.info("[PO] Attempting to create a new purchase order.");

  const { supplier_name, supplier_contact, items } = req.body;

  if (!items || items.length === 0) {
    logger.warn("[PO] Creation failed: items.");
    return res.status(400).json({ message: "At least one item is required." });
  }

  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    logger.info("[PO] Starting transaction for new Purchase Order.");

    const poQuery = `
            INSERT INTO purchase_orders (supplier_name, supplier_contact)
            VALUES ($1, $2)
            RETURNING purchase_id, purchase_code;
        `;

    const poResult = await client.query(poQuery, [
      supplier_name || null,
      supplier_contact || null,
    ]);

    const { purchase_id, purchase_code } = poResult.rows[0];

    logger.info(
      `[PO] Created new Purchase Order Header: ID ${purchase_id}, Code ${purchase_code}.`
    );

    logger.info(
      `[PO] Attempting to insert items for Purchase Order ID: ${purchase_id}`
    );

    for (const item of items) {
      const { product_id, quantity, purchase_rate } = item;

      if (!product_id || quantity <= 0 || purchase_rate <= 0) {
        logger.error(
          `[PO] Item validation failed for item ${product_id}. Aborting.`
        );
        throw new Error("Invalid item data provided.");
      }
      const itemQuery = `
                INSERT INTO purchase_order_items (purchase_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4);
            `;
      await client.query(itemQuery, [
        purchase_id,
        product_id,
        quantity,
        purchase_rate,
      ]);
      logger.info(
        `[PO] Item added: Product ID ${product_id}, Quantity ${quantity}.`
      );

      logger.info(
        `[PO] Updating stock for Product ID ${product_id} by adding ${quantity}.`
      );

      const stockUpsertQuery = `
                  INSERT INTO stocks (product_id, available_quantity)
                  VALUES ($1, $2)
                  ON CONFLICT (product_id) 
                  DO UPDATE 
                  SET available_quantity = stocks.available_quantity + EXCLUDED.available_quantity,
                      last_updated = CURRENT_TIMESTAMP;
              `;
      await client.query(stockUpsertQuery, [product_id, quantity]);

      logger.info(
        `[PO] Successfully updated stock for Product ID ${product_id} by adding ${quantity}.`
      );
    }

    await client.query("COMMIT");

    logger.info(
      `[PO] Transaction successful. Purchase Order ${purchase_code} fully created.`
    );
    res.status(201).json({
      purchase_id,
      purchase_code,
      message: "Purchase Order created and stock updated successfully.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(
      `[PO] !!! CRITICAL FAILURE !!! Transaction rolled back. Reason: ${error.message}`
    );
    res
      .status(500)
      .json({ message: "Internal server error: PO creation failed." , error: error.message });
  } finally {
    client.release();
  }
};
