import { API_BASE_URL } from './config';

export const getCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/categories`);
  const data = await res.json();
  return data.data || data;
};

export const getCategoryBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/categories/${slug}`);
  const data = await res.json();
  return data.data || data;
};
