import axiosClient from "@/utils/apiClient";

export const getDashboardSummary = async () => {
  const res = await axiosClient.get("/analytics/summary");
  return res.data;
};

export const getSystemLogs = async () => {
  const res = await axiosClient.get("/analytics/logs");
  return res.data;
};
