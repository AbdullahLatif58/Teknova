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
          `SELECT id, total_stock, price, is_active
            FROM products WHERE id = ? FOR UPDATE`,
          [item.product_id]
        );

        if (!product) throw new Error("Product not found");
        if (!product.is_active) throw new Error("Product is inactive");
        if (product.total_stock < item.quantity) throw new Error("Insufficient product stock");

        unit_price = product.price;
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
        await connection.query(
          "UPDATE product_variants SET stock = stock - ? WHERE id = ?",
          [item.quantity, item.variant_id]
        );
      } else {
        await connection.query(
          "UPDATE products SET total_stock = total_stock - ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }
    }

    await connection.commit();
    return orderId;
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

  const [items] = await pool.query(
    "SELECT * FROM order_items WHERE order_id = ?",
    [orderId]
  );

  return { ...order, items };
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
        await connection.query(
          "UPDATE product_variants SET stock = stock + ? WHERE id = ?",
          [item.quantity, item.variant_id]
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