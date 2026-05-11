import { Request, Response } from "express";
import * as contactsService from "./contacts.services";

export async function submitContact(req: Request, res: Response) {
  try {
    const contact = await contactsService.createContact(req.body);
    return res.status(201).json({ success: true, contact });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function listContacts(req: Request, res: Response) {
  try {
    const contacts = await contactsService.getContacts();
    return res.status(200).json({ success: true, contacts });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function removeContact(req: Request, res: Response) {
  try {
    await contactsService.deleteContact(req.params.id as string);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
