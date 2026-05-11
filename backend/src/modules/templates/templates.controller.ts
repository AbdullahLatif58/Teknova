import { Request, Response } from "express";
import * as templateService from "./templates.services";

export async function applyTemplate(req: Request, res: Response) {
  try {
    const { userId, templateName } = req.body;
    
    // Fallbacks if userId is passed differently in auth setup
    const uid = userId || req.headers['x-user-id'] || (req as any)?.user?.id;

    if (!uid) {
      return res.status(401).json({ success: false, message: "User ID required" });
    }
    if (!templateName) {
      return res.status(400).json({ success: false, message: "templateName is required" });
    }

    const result = await templateService.setTemplateForUser(uid, templateName);
    return res.status(200).json({ success: true, result });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getActiveTemplate(req: Request, res: Response) {
  try {
    // Attempt extracting user ID from query, body, or headers
    const uid = req.query.userId || req.body.userId || req.headers['x-user-id'] || (req as any)?.user?.id;

    if (!uid) {
      return res.status(401).json({ success: false, message: "User ID required" });
    }

    const templateName = await templateService.getTemplateForUser(uid as string);
    return res.status(200).json({ success: true, templateName });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
