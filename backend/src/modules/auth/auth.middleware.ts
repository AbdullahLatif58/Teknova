// auth.middleware.ts
// Middleware to verify JWT tokens and attach user info to request.

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "./auth.model"; // Adjusted import path
import { updateUserActivity } from "../../services/onlineTracker.service";

// Load secret from environment (ensure .env has JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = (req.headers["authorization"] || req.headers["Authorization"]) as string;
  let token = authHeader && authHeader.toLowerCase().startsWith("bearer ") ? authHeader.split(" ")[1] : null;

  // Fallback to cookie if not in header
  if (!token) {
    token = req.cookies?.accessToken;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token missing" });
  }

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    // Attach user payload to request
    req.user = payload;
    // Update online activity timestamp
    updateUserActivity(payload.id);
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
