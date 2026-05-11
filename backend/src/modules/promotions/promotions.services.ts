import { pool } from "../../config/db";
import { PromoCode } from "./promotions.model";
import { generateUUID } from "../../utils/uuui";
import { AppError } from "../../utils/errors";

export interface CreatePromoInput {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses?: number | null;
  expires_at?: string | null;
}

export async function createPromoCode(data: CreatePromoInput): Promise<string> {
  const id = generateUUID();
  
  await pool.query(
    `INSERT INTO promo_codes 
      (id, code, discount_type, discount_value, max_uses, expires_at) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.code,
      data.discount_type,
      data.discount_value,
      data.max_uses || null,
      data.expires_at || null,
    ]
  );
  
  return id;
}

export async function getPromoCodes(): Promise<PromoCode[]> {
  const [rows] = await pool.query(
    "SELECT * FROM promo_codes ORDER BY created_at DESC"
  );
  return rows as PromoCode[];
}

export async function validatePromoCode(code: string, totalAmount: number): Promise<{ valid: boolean, discount: number, message?: string }> {
  const [[promo]]: any = await pool.query(
    "SELECT * FROM promo_codes WHERE code = ?",
    [code]
  );

  if (!promo) {
    return { valid: false, discount: 0, message: "Invalid promo code" };
  }

  if (!promo.is_active) {
    return { valid: false, discount: 0, message: "Promo code is no longer active" };
  }

  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return { valid: false, discount: 0, message: "Promo code has expired" };
  }

  if (promo.max_uses !== null && promo.current_uses >= promo.max_uses) {
    return { valid: false, discount: 0, message: "Promo code usage limit reached" };
  }

  // Calculate discount
  let discount = 0;
  if (promo.discount_type === "percentage") {
    discount = (totalAmount * Number(promo.discount_value)) / 100;
  } else if (promo.discount_type === "fixed") {
    discount = Number(promo.discount_value);
  }

  // Ensure discount isn't more than the total amount
  if (discount > totalAmount) {
    discount = totalAmount;
  }

  return { valid: true, discount };
}

export async function incrementPromoUsage(code: string, connection: any): Promise<void> {
  await connection.query(
    "UPDATE promo_codes SET current_uses = current_uses + 1 WHERE code = ?",
    [code]
  );
}
