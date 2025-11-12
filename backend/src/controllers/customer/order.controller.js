const db = require("../../config/db");
const logger = require("../../config/logger");
const { convertToBaseUnit } = require("../../utils/customer/unitConverter");
const puppeteer = require("puppeteer");
const { getInvoiceHTML } = require("../../utils/common/invoiceTemplate");
const numberToWords = require("number-to-words");

exports.placeOrder = async (req, res) => {
  const customer_id = req.customer.customer_id;
  const { cartItems, paymentMethod, customer_details } = req.body;
  const deliveryCharges = req.body.customer_details.delivery_charges || 0;
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty." });
  }

  const client = await db.connect();
  logger.info(
    `[ORDER] Starting order placement for customer ID: ${customer_id}`
  );

  let newOrder;

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

    newOrder = orderResult.rows[0];

    const { sales_order_id } = orderResult.rows[0];

    logger.info(`[ORDER] Created sales_order with ID: ${sales_order_id}`);

    let subtotal = 0;

    for (const item of cartItems) {
      const productQuery =
        "SELECT unit_type FROM products WHERE product_id = $1";
      const productResult = await client.query(productQuery, [item.product_id]);
      if (productResult.rows.length === 0) {
        throw new Error(`Product with ID ${item.product_id} not found.`);
      }
      const baseUnit = productResult.rows[0].unit_type;

      const price = parseFloat(item.selling_price);
      const quantity = parseFloat(item.quantity);
      if (isNaN(price) || isNaN(quantity)) throw new Error(`Invalid price/quantity for ${item.product_name}`);
      subtotal += quantity * price;
      
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
        throw new Error(`Insufficient stock for product: ${item.product_name}`);
      }
      logger.info(
        `[ORDER] Deducted ${deductionAmount} ${baseUnit} for product ${item.product_name}`
      );
    }

    subtotal = parseFloat(subtotal.toFixed(2));
    const totalAmount = subtotal + deliveryCharges;
    logger.info(
      `[INVOICE] Creating invoice record for sales_order ID: ${sales_order_id}`
    );
    const invoiceInsertQuery = `
      INSERT INTO invoices (sales_order_id, customer_id, subtotal, delivery_charges, total_amount, shipping_address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING invoice_id, invoice_code, invoice_date;
    `;
    
    console.log("customer_details.address:", customer_details.address);

    const invoiceResult = await client.query(invoiceInsertQuery, [
      sales_order_id,
      customer_id,
      subtotal,
      deliveryCharges,
      totalAmount,
      customer_details.address,
    ]);

    const newInvoice = invoiceResult.rows[0];
    logger.info(
      `[INVOICE] Successfully created invoice with code: ${newInvoice.invoice_code}`
    );

    await client.query("COMMIT");
    logger.info(
      `[ORDER] Order ${sales_order_id} successfully placed and committed.`
    );

    const totalInWords = numberToWords.toWords(totalAmount);
    const capitalizedTotalInWords =
      totalInWords.charAt(0).toUpperCase() + totalInWords.slice(1);

    const invoiceData = {
      order: {
        ...newOrder,
        sales_order_code: newInvoice.invoice_code,
        order_date: newInvoice.invoice_date,
      },
      customer: customer_details,
      items: cartItems.map((item) => ({
        ...item,
        quantity: parseFloat(item.quantity),
        selling_price: parseFloat(item.selling_price),
      })),
      subtotal: subtotal,
      deliveryCharges: deliveryCharges,
      total: totalAmount,
      totalInWords: capitalizedTotalInWords,
    };

    logger.info(
      `[PDF] Generating invoice PDF for invoice code: ${newInvoice.invoice_code}`
    );
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const htmlContent = getInvoiceHTML(invoiceData);
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${newInvoice.invoice_code}.pdf`
    );
    return res.status(201).send(pdfBuffer);
  } catch (error) {
    console.error("Error placing order:", error);
    await client.query("ROLLBACK");
    logger.error(
      `[ORDER] Error during order placement: ${error.message}. Transaction rolled back.`
    );
    return res
      .status(400)
      .json({ message: error.message || "Failed to place order." });
  } finally {
    client.release();
  }
};
