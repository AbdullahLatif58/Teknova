import axiosClient from "@/utils/apiClient";
import { Order, OrderResponse } from "@/types/order";

export const getOrders = async (page = 1, limit = 50): Promise<OrderResponse<Order[]>> => {
  const res = await axiosClient.get<OrderResponse<Order[]>>(`/orders?page=${page}&limit=${limit}`);
  
  // Standardize the response data regardless of backend format
  if (res.data && !res.data.orders && res.data.data) {
    res.data.orders = res.data.data;
  }
  return res.data;
};

export const getOrderById = async (id: string | number): Promise<Order | null> => {
  try {
    const res = await axiosClient.get<OrderResponse<Order>>(`/orders/${id}`);
    // Backend may return it in `.order`, `.data`, or directly
    // @ts-ignore
    return res.data.order || res.data.data || res.data;
  } catch (err) {
    console.error(`Failed to fetch order ${id}:`, err);
    return null;
  }
};

export const createOrder = async (orderData: Partial<Order>): Promise<OrderResponse<Order>> => {
  const res = await axiosClient.post<OrderResponse<Order>>("/orders", orderData);
  return res.data;
};

export const updateOrderStatus = async (
  id: string | number, 
  status: "pending" | "processing" | "completed" | "cancelled"
): Promise<OrderResponse<Order>> => {
  const res = await axiosClient.put<OrderResponse<Order>>(`/orders/${id}/status`, { status });
  return res.data;
};

export const cancelOrder = async (id: string | number): Promise<OrderResponse<Order>> => {
  const res = await axiosClient.put<OrderResponse<Order>>(`/orders/${id}/cancel`);
  return res.data;
};
