import { Request, Response } from "express";
import * as subscriptionsService from "./subscriptions.services";

export async function addSubscriber(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    
    const subscriber = await subscriptionsService.createSubscription(email);
    return res.status(201).json({ success: true, subscriber });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: "Email already subscribed" });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function listSubscribers(req: Request, res: Response) {
  try {
    const subscribers = await subscriptionsService.getSubscriptions();
    return res.status(200).json({ success: true, subscribers });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function removeSubscriber(req: Request, res: Response) {
  try {
    await subscriptionsService.deleteSubscription(req.params.id as string);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
