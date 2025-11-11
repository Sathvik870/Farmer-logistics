const db = require("../../config/db");
const logger = require("../../config/logger");
const { convertToBaseUnit } = require("../../utils/customer/unitConverter");

exports.placeOrder = async (req, res) => {
  const customer_id = req.customer.customer_id;
  const { cartItems, paymentMethod } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  const client = await db.connect();
  logger.info(
    `[ORDER] Starting order placement for customer ID: ${customer_id}`
  );

  try {
    await client.query("BEGIN");
    const orderQuery = `
      INSERT INTO sales_orders (customer_id, payment_method, status)
      VALUES ($1, $2, 'Confirmed')
      RETURNING sales_order_id, order_date;
    `;
    const orderResult = await client.query(orderQuery, [
      customer_id,
      paymentMethod || "COD",
    ]);
    const { sales_order_id, order_date } = orderResult.rows[0];

    logger.info(`[ORDER] Created sales_order with ID: ${sales_order_id}`);

    for (const item of cartItems) {
      const productQuery =
        "SELECT unit_type FROM products WHERE product_id = $1";
      const productResult = await client.query(productQuery, [item.product_id]);
      if (productResult.rows.length === 0) {
        throw new Error(`Product with ID ${item.product_id} not found.`);
      }
      const baseUnit = productResult.rows[0].unit_type;

      const deductionAmount = convertToBaseUnit(
        item.quantity,
        item.selling_unit,
        item.sell_per_unit_qty,
        baseUnit
      );

      const orderItemQuery = `
        INSERT INTO sales_order_items (sales_order_id, product_id, sold_quantity, sold_price)
        VALUES ($1, $2, $3, $4);
      `;
      await client.query(orderItemQuery, [
        sales_order_id,
        item.product_id,
        item.quantity,
        item.selling_price,
      ]);
      const stockUpdateQuery = `
        UPDATE stocks
        SET 
          saleable_quantity = saleable_quantity - $1,
          last_updated = CURRENT_TIMESTAMP
        WHERE 
          product_id = $2 AND saleable_quantity >= $1;
      `;
      const stockUpdateResult = await client.query(stockUpdateQuery, [
        deductionAmount,
        item.product_id,
      ]);

      if (stockUpdateResult.rowCount === 0) {
        logger.error(
          `[ORDER] Insufficient stock for product ID: ${item.product_id}. Rolling back transaction.`
        );
        return res
          .status(400)
          .json({
            message: `Insufficient stock for product: ${item.product_name}`,
          });
      }
      logger.info(
        `[ORDER] Deducted ${deductionAmount} ${baseUnit} for product ${item.product_name}`
      );
    }

    await client.query("COMMIT");
    logger.info(
      `[ORDER] Order ${sales_order_id} successfully placed and committed.`
    );

    res.status(201).json({
      message: "Order placed successfully!",
      orderId: sales_order_id,
      orderDate: order_date,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error(
      `[ORDER] Error placing order for customer ${customer_id}: ${error.message}. Transaction rolled back.`
    );
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Failed to place order." });
  } finally {
    client.release();
  }
};
