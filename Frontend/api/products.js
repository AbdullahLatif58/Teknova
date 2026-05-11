import { API_BASE_URL } from './config';

export const getProducts = async (limit = 100) => {
  const res = await fetch(`${API_BASE_URL}/products?limit=${limit}`);
  return res.json();
};

export const getFeaturedProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/products/featured`);
  return res.json();
};

export const getNewProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/products/new`);
  return res.json();
};

export const getProductBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/products/${slug}`);
  return res.json();
};

export const getProductsByCategory = async (categoryId) => {
  const res = await fetch(`${API_BASE_URL}/products/category?category_id=${categoryId}`);
  return res.json();
};

export const searchProducts = async (query) => {
  const res = await fetch(`${API_BASE_URL}/products/search?q=${query}`);
  return res.json();
};

export const filterProducts = async (filters) => {
  const queryString = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE_URL}/products/filter?${queryString}`);
  return res.json();
};
