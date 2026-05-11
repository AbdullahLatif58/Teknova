import { API_BASE_URL } from './config';

export const createOrder = async (orderData) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return res.json();
};

export const getUserOrders = async (userId, token) => {
  const res = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

export const getOrderById = async (orderId, token) => {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

export const cancelOrder = async (orderId, token) => {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};
