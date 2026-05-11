import { pool } from "../../config/db";
import { generateUUID } from "../../utils/uuui";

export async function createReview(productId: string, userId: string, rating: number, comment?: string) {
  const id = generateUUID();
  await pool.query(
    "INSERT INTO reviews (id, product_id, user_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
    [id, productId, userId, rating, comment || null]
  );
  return { id, productId, userId, rating, comment };
}

export async function getReviewsForProduct(productId: string) {
  const [rows] = await pool.query(
    `SELECT r.*, u.name as user_name 
     FROM reviews r 
     LEFT JOIN users u ON r.user_id = u.id 
     WHERE r.product_id = ? 
     ORDER BY r.created_at DESC`,
    [productId]
  );
  return rows;
}

export async function deleteReview(reviewId: string) {
  await pool.query("DELETE FROM reviews WHERE id = ?", [reviewId]);
  return { success: true };
}
