import { API_BASE_URL } from './config';

export const getCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/categories`);
  return res.json();
};

export const getCategoryBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/categories/${slug}`);
  return res.json();
};
