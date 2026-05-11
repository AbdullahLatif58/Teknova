import { pool } from "../../config/db";
import { generateUUID } from "../../utils/uuui";

export async function setTemplateForUser(userId: string, templateName: string) {
  // Check if a row already exists for this user
  const [existing] = await pool.query(
    "SELECT id FROM user_templates WHERE user_id = ?",
    [userId]
  );

  if ((existing as any[]).length > 0) {
    // Update existing
    await pool.query(
      "UPDATE user_templates SET template_name = ? WHERE user_id = ?",
      [templateName, userId]
    );
    return { userId, templateName, updated: true };
  } else {
    // Insert new
    const id = generateUUID();
    await pool.query(
      "INSERT INTO user_templates (id, user_id, template_name) VALUES (?, ?, ?)",
      [id, userId, templateName]
    );
    return { userId, templateName, created: true };
  }
}

export async function getTemplateForUser(userId: string) {
  const [rows] = await pool.query(
    "SELECT template_name FROM user_templates WHERE user_id = ?",
    [userId]
  );
  
  if ((rows as any[]).length > 0) {
    return (rows as any[])[0].template_name;
  }
  return null; // No template explicitly set
}
