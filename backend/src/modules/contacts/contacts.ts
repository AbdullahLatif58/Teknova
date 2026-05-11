// Model
export interface Contact {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: 'new' | 'read' | 'replied';
  created_at?: Date;
}

// Services (contacts.services.ts)
import { pool } from "../../config/db";
import { generateUUID } from "../../utils/uuui";

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

// Controller (contacts.controller.ts)
import { Request, Response } from "express";

export async function submitContact(req: Request, res: Response) {
  try {
    const contact = await createContact(req.body);
    return res.status(201).json({ success: true, contact });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function listContacts(req: Request, res: Response) {
  try {
    const contacts = await getContacts();
    return res.status(200).json({ success: true, contacts });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function removeContact(req: Request, res: Response) {
  try {
    await deleteContact(req.params.id as string);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Routes (contacts.routes.ts)
import { Router } from "express";
import { authenticateToken } from "../auth/auth.middleware";
import { authorizeAdmin } from "../auth/admin.middleware";

const router = Router();

router.post("/", submitContact); // Public
router.get("/", authenticateToken, authorizeAdmin, listContacts);
router.delete("/:id", authenticateToken, authorizeAdmin, removeContact);

export default router;
