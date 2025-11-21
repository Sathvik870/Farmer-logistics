const db = require("../../config/db");
const logger = require("../../config/logger");

exports.getAllSalesOrders = async (req, res) => {
  logger.info("[ADMIN_SALES] Fetching all sales orders.");
  try {
    const query = `
      SELECT 
        so.sales_order_id,
        so.order_date,
        so.status as delivery_status,
        c.customer_id,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.phone_number,
        i.shipping_address,
        i.total_amount,
        COALESCE(
          json_agg(
            json_build_object(
              'product_name', p.product_name,
              'quantity', soi.sold_quantity,
              'unit_type', p.unit_type,
              'selling_unit', p.selling_unit,
              'price', soi.sold_price
            )
          ) FILTER (WHERE soi.item_id IS NOT NULL), '[]'
        ) as order_items
      FROM sales_orders so
      JOIN customers c ON so.customer_id = c.customer_id
      LEFT JOIN invoices i ON so.sales_order_id = i.sales_order_id
      LEFT JOIN sales_order_items soi ON so.sales_order_id = soi.sales_order_id
      LEFT JOIN products p ON soi.product_id = p.product_id
      GROUP BY so.sales_order_id, c.customer_id, i.invoice_id
      ORDER BY so.order_date DESC;
    `;

    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    logger.error(`[ADMIN_SALES] Error fetching orders: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  logger.info(`[ADMIN_SALES] Updating order ${id} status to: ${status}`);

  if (!status) {
    return res.status(400).json({ message: "Status is required." });
  }

  const allowedStatuses = [
    "Confirmed",
    "Packing",
    "In Transit",
    "Delivered",
    "Cancelled",
  ];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const query = `
      UPDATE sales_orders 
      SET status = $1 
      WHERE sales_order_id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [status, id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    res
      .status(200)
      .json({ message: "Status updated successfully", order: rows[0] });
  } catch (error) {
    logger.error(
      `[ADMIN_SALES] Error updating status for order ${id}: ${error.message}`
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
