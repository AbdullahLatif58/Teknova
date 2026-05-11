import { API_BASE_URL } from './config';

export const subscribeNewsletter = async (email) => {
  const res = await fetch(`${API_BASE_URL}/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
};
