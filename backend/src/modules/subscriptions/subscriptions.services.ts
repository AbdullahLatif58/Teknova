import { pool } from "../../config/db";
import { generateUUID } from "../../utils/uuui";
import { Subscription } from "./subscriptions.model";

export async function createSubscription(email: string) {
  const id = generateUUID();
  await pool.query(
    "INSERT INTO subscriptions (id, email) VALUES (?, ?)",
    [id, email]
  );
  return { id, email };
}

export async function getSubscriptions() {
  const [rows] = await pool.query("SELECT * FROM subscriptions ORDER BY created_at DESC");
  return rows;
}

export async function deleteSubscription(id: string) {
  await pool.query("DELETE FROM subscriptions WHERE id = ?", [id]);
  return { success: true };
}
