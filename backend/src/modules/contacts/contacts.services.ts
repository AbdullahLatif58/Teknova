import { pool } from "../../config/db";
import { generateUUID } from "../../utils/uuui";
import { Contact } from "./contacts.model";

export async function createContact(data: Contact) {
  const id = generateUUID();
  await pool.query(
    "INSERT INTO contacts (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)",
    [id, data.name, data.email, data.subject, data.message]
  );
  return { id, ...data };
}

export async function getContacts() {
  const [rows] = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
  return rows;
}

export async function deleteContact(id: string) {
  await pool.query("DELETE FROM contacts WHERE id = ?", [id]);
  return { success: true };
}
