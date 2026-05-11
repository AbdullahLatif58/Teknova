import { Request, Response, NextFunction } from "express";

/**
 * Middleware to restrict access to admin users only.
 * Assumes authenticateToken has already run and populated req.user.
 */
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const role = user.role?.toString().toLowerCase();

  if (role !== "admin") {
    return res.status(403).json({ success: false, message: `Admin access required (Current role: ${user.role})` });
  }

  next();
};
