import { pool } from "../../config/db";
import { Order, OrderItem } from "./orders.model";
import { generateUUID } from "../../utils/uuui";
import { validatePromoCode, incrementPromoUsage } from "../promotions/promotions.services";

interface CreateOrderInput {
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  payment_method: Order["payment_method"];
  shipping_address: string;
  billing_address: string;
  promo_code?: string | null;
  items: Array<{
    product_id: string;
    variant_id?: string | null;
    quantity: number;
    unit_price?: number;
  }>;
}

export async function createOrder(data: CreateOrderInput): Promise<string> {
  const connection = await pool.getConnection();
  const id = generateUUID();
  try {
    await connection.beginTransaction();

    let original_amount = 0;
    let discount_amount = 0;


    for (const item of data.items) {
      let unit_price = 0;

      if (item.variant_id) {

        const [[variant]]: any = await connection.query(
          `SELECT pv.id AS variant_id, pv.product_id, pv.stock, pv.price AS variant_price, p.is_active AS product_active
            FROM product_variants pv
            JOIN products p ON p.id = pv.product_id
            WHERE pv.id = ? FOR UPDATE`,
          [item.variant_id]
        );

        if (!variant) throw new Error("Variant not found");
        if (variant.product_id !== item.product_id)
          throw new Error("Variant does not belong to product");
        if (!variant.product_active) throw new Error("Product is inactive");
        if (variant.stock < item.quantity) throw new Error("Insufficient variant stock");

        unit_price = variant.variant_price;
      } else {

        const [[product]]: any = await connection.query(
          `SELECT p.id, p.total_stock, p.price, p.is_active, pv.id as default_variant_id
            FROM products p
            LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.is_default = 1
            WHERE p.id = ? FOR UPDATE`,
          [item.product_id]
        );

        if (!product) throw new Error("Product not found");
        if (!product.is_active) throw new Error("Product is inactive");
        if (product.total_stock < item.quantity) throw new Error("Insufficient product stock");

        unit_price = product.price;
        item.variant_id = product.default_variant_id; // Auto-assign default variant if missing
      }


      original_amount += unit_price * item.quantity;

      item.unit_price = unit_price;
    }

    if (data.promo_code) {
      const promoResult = await validatePromoCode(data.promo_code, original_amount);
      if (promoResult.valid) {
        discount_amount = promoResult.discount;
        await incrementPromoUsage(data.promo_code, connection);
      } else {
        throw new Error(`Promo code error: ${promoResult.message}`);
      }
    }

    const total_amount = original_amount - discount_amount;


    await connection.query(
      `INSERT INTO orders
       (id, user_id, customer_name, customer_email, customer_mobile, status,
        total_amount, original_amount, discount_amount, payment_method,
        shipping_address, billing_address, is_paid)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, 0)`,
      [
        id,
        data.user_id || null,
        data.customer_name,
        data.customer_email,
        data.customer_mobile,
        total_amount,
        original_amount,
        discount_amount,
        data.payment_method,
        data.shipping_address,
        data.billing_address,
      ]
    );

    const orderId = id;


    for (const item of data.items) {
      const final_price = item.unit_price! * item.quantity;

      const itemId = generateUUID();
      await connection.query(
        `INSERT INTO order_items
         (id, order_id, product_id, variant_id, quantity, unit_price,
          discount_type, discount_value, final_price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          itemId,
          orderId,
          item.product_id,
          item.variant_id || null,
          item.quantity,
          item.unit_price,
          null,
          null,
          final_price,
        ]
      );


      if (item.variant_id) {
        // Deduct from variant
        await connection.query(
          "UPDATE product_variants SET stock = stock - ? WHERE id = ?",
          [item.quantity, item.variant_id]
        );
        // Also deduct from main product total
        await connection.query(
          "UPDATE products SET total_stock = total_stock - ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      } else {
        await connection.query(
          "UPDATE products SET total_stock = total_stock - ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }
    }

    await connection.commit();

    // Send confirmation email
    try {
      const emailItems = [];
      for (const item of data.items) {
         const [[product]]: any = await pool.query("SELECT title, images FROM products WHERE id = ?", [item.product_id]);
         const imgs = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
         emailItems.push({
           name: product.title,
           quantity: item.quantity,
           price: (item.unit_price! * item.quantity).toFixed(2),
           image: imgs && imgs[0] ? imgs[0] : 'https://placehold.co/100x100'
         });
      }

      const { addEmailToQueue } = require("../../notifications/queues/emailQueue");
      await addEmailToQueue({
        to: data.customer_email,
        subject: "Order Confirmation - Teknova",
        template: "orderConfirmation",
        context: {
          name: data.customer_name,
          orderId: id.substring(0, 8).toUpperCase(),
          total: total_amount.toFixed(2),
          date: new Date().toLocaleDateString(),
          items: emailItems
        }
      });
    } catch (emailErr) {
      console.error("Failed to send order email:", emailErr);
      // Don't fail the order if email fails
    }

    return id;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function getOrders(): Promise<Order[]> {
  const [rows] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  return rows as Order[];
}

export async function getOrderById(orderId: string) {
  const [[order]]: any = await pool.query(
    "SELECT * FROM orders WHERE id = ?",
    [orderId]
  );

  if (!order) return null;

  const [items]: any = await pool.query(
    `SELECT oi.*, p.title as product_name, pv.sku as variant_sku, 
            COALESCE(pv.image_url, p.images) as image_url
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     LEFT JOIN product_variants pv ON oi.variant_id = pv.id
     WHERE oi.order_id = ?`,
    [orderId]
  );

  const normalizedItems = items.map((item: any) => {
    let img = item.image_url;
    try {
      const parsed = typeof img === 'string' ? JSON.parse(img) : img;
      img = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e) {
      // Keep as is
    }
    return { ...item, image_url: img };
  });

  return { ...order, items: normalizedItems };
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
) {
  await pool.query("UPDATE orders SET status = ? WHERE id = ?", [
    status,
    orderId,
  ]);
}

export async function cancelOrder(orderId: string) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [items]: any = await connection.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderId]
    );

    for (const item of items) {
      if (item.variant_id) {
        // Restore to variant
        await connection.query(
          "UPDATE product_variants SET stock = stock + ? WHERE id = ?",
          [item.quantity, item.variant_id]
        );
        // Also restore to main product total
        await connection.query(
          "UPDATE products SET total_stock = total_stock + ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      } else {
        await connection.query(
          "UPDATE products SET total_stock = total_stock + ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }
    }

    await connection.query(
      "UPDATE orders SET status = 'cancelled' WHERE id = ?",
      [orderId]
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}