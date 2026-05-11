// backend/src/services/onlineTracker.service.ts
// Service to track user online activity (last active timestamp).

import { pool } from "../config/db"; // Adjust path based on project structure

/**
 * Updates the `lastActiveAt` timestamp for the given user.
 * This function is called by the auth middleware on each authenticated request.
 */
export async function updateUserActivity(userId: number): Promise<void> {
  try {
    // Assuming the `users` table has a `lastActiveAt` column of type DATETIME/TIMESTAMP.
    await pool.query(
      "UPDATE users SET updated_at = NOW() WHERE id = ?",
      [userId]
    );
  } catch (error) {
    console.error("Failed to update user activity:", error);
    // Swallow error to avoid breaking request flow; activity tracking is non‑critical.
  }
}
