import { Router } from "express";
import { getDashboardStats, getSystemLogs } from "./analytics.controller";

const router = Router();

// Endpoint for all dashboard components
router.get("/summary", getDashboardStats);

// Endpoint for raw logs
router.get("/logs", getSystemLogs);

export default router;
