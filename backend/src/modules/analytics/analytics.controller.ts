import { Request, Response } from "express";
import * as analyticsService from "./analytics.services";

export async function getDashboardStats(req: Request, res: Response) {
  try {
    // Run them in parallel for speed!
    const [summary, recentOrders, chartData, activityFeed] = await Promise.all([
      analyticsService.getDashboardSummary(),
      analyticsService.getRecentOrders(5),
      analyticsService.getSalesChartData(7),
      analyticsService.getActivityFeed(5)
    ]);

    return res.status(200).json({
      success: true,
      metrics: summary,
      recentOrders,
      chartData,
      activityFeed
    });
  } catch (err: any) {
    console.error("Dashboard Stats Error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
}

export async function getSystemLogs(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const logs = await analyticsService.getApiLogs(limit);

    return res.status(200).json({
      success: true,
      logs
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
