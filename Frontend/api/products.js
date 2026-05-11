import { API_BASE_URL } from './config';

export const getProducts = async (limit = 100) => {
  const res = await fetch(`${API_BASE_URL}/products?limit=${limit}`);
  const data = await res.json();
  return data.data || data;
};

export const getFeaturedProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/products/featured`);
  const data = await res.json();
  return data.data || data;
};

export const getNewProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/products/new`);
  const data = await res.json();
  return data.data || data;
};

export const getProductBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/products/${slug}`);
  const data = await res.json();
  return data.data || data;
};

export const getProductsByCategory = async (categoryId) => {
  const res = await fetch(`${API_BASE_URL}/products/category?category_id=${categoryId}`);
  const data = await res.json();
  return data.data || data;
};

export const searchProducts = async (query) => {
  const res = await fetch(`${API_BASE_URL}/products/search?query=${query}`);
  const data = await res.json();
  return data.data || data;
};

export const filterProducts = async (filters) => {
  const queryString = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE_URL}/products/filter?${queryString}`);
  const data = await res.json();
  return data.data || data;
};
