import { API_BASE_URL } from './config';
import { AMAZON_FALLBACK_DATA, mapAmazonProducts } from './amazonFallback';

// Always use PK country for all searches
const DEFAULT_COUNTRY = 'PK';

export const searchAmazon = async (query, limit = 3) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/amazon/search-with-details?q=${encodeURIComponent(query)}&country=${DEFAULT_COUNTRY}&limit=${limit}`,
      { signal: AbortSignal.timeout(10000) } // 10s timeout to avoid hanging
    );

    if (!res.ok) {
      console.warn(`[Amazon API] HTTP ${res.status} for query: "${query}". Using fallback.`);
      return { success: true, data: AMAZON_FALLBACK_DATA, isFallback: true };
    }

    const json = await res.json();

    if (!json.success || !json.data?.length) {
      console.warn(`[Amazon API] No results for "${query}". Using fallback.`);
      return { success: true, data: AMAZON_FALLBACK_DATA, isFallback: true };
    }

    return json;
  } catch (err) {
    console.warn('[Amazon API] Request failed, using fallback data.', err?.message);
    return { success: true, data: AMAZON_FALLBACK_DATA, isFallback: true };
  }
};

export { mapAmazonProducts, AMAZON_FALLBACK_DATA };
