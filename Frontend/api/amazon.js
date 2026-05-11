import { API_BASE_URL } from './config';

export const searchAmazon = async (query, limit = 3) => {
  const res = await fetch(`${API_BASE_URL}/amazon/search-with-details?q=${query}&limit=${limit}`);
  return res.json();
};
