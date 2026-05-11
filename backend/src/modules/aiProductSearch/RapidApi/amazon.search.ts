

import type {
  AmazonSearchParams,
  AmazonProductDetailsParams,
  AmazonProductReviewsParams,
  AmazonSearchResponse,
  AmazonReviewsResponse,
  AmazonProduct,
  AmazonReview,
  ApiResponse,
} from "./amazon.types";

// ── Config ────────────────────────────────────

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY ?? "ee8504702amsh7d55b3cf878f605p107aaejsn2a0dd59bc4f8";
const RAPIDAPI_HOST = "real-time-amazon-data.p.rapidapi.com";
const BASE_URL = `https://${RAPIDAPI_HOST}`;

const DEFAULT_COUNTRY = "PK" as const;
const MAX_PRODUCTS = 3;
const REQUEST_TIMEOUT = 8_000;
const CACHE_TTL = 5 * 60_000;

const BASE_HEADERS = {
  "Content-Type": "application/json",
  "x-rapidapi-host": RAPIDAPI_HOST,
  "x-rapidapi-key": RAPIDAPI_KEY,
};

// ── In-memory cache ───────────────────────────

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}



function buildUrl(
  path: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "") {
      url.searchParams.set(key, String(val));
    }
  }
  return url.toString();
}

async function apiFetch<T>(url: string): Promise<T> {

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: BASE_HEADERS,
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "No response body");
      throw new Error(`RapidAPI ${response.status}: ${text}`);
    }

    return response.json() as Promise<T>;

  } catch (err) {

    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`Request timed out after ${REQUEST_TIMEOUT / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}


export async function searchProducts(
  params: AmazonSearchParams
): Promise<ApiResponse<AmazonProduct[]>> {
  const country = params.country ?? DEFAULT_COUNTRY;
  const cacheKey = `search::${params.query.toLowerCase().trim()}::${country}`;


  const cached = getCached<AmazonProduct[]>(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] "${params.query}" (${country})`);
    return { success: true, country, total: cached.length, page: 1, data: cached };
  }

  try {
    const url = buildUrl("/search", {
      query: params.query.trim(),
      country,
      category_id: params.category_id,
      min_price: params.min_price,
      max_price: params.max_price,
      sort_by: params.sort_by ?? "RELEVANCE",
      page: 1,
    });

    console.log(`[API CALL] Searching: "${params.query}" in ${country}`);
    const raw = await apiFetch<AmazonSearchResponse>(url);

    if (raw.status !== "OK") {
      return { success: false, error: "Amazon API returned a non-OK status." };
    }


    const products = raw.data.products.slice(0, MAX_PRODUCTS);

    setCached(cacheKey, products);

    return {
      success: true,
      country: raw.data.country,
      total: products.length,
      page: 1,
      data: products,
    };

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: "Failed to fetch products", details: message };
  }
}



export async function getProductDetails(
  params: AmazonProductDetailsParams
): Promise<ApiResponse<AmazonProduct>> {
  const country = params.country ?? DEFAULT_COUNTRY;
  const cacheKey = `detail::${params.asin}::${country}`;

  const cached = getCached<AmazonProduct>(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] ASIN: ${params.asin}`);
    return { success: true, country, total: 1, page: 1, data: cached };
  }

  try {
    const url = buildUrl("/product-details", {
      asin: params.asin,
      country,
    });

    console.log(`[API CALL] Details: ${params.asin}`);
    const raw = await apiFetch<{ status: string; data: AmazonProduct }>(url);

    if (raw.status !== "OK") {
      return { success: false, error: "Product not found or API error." };
    }

    setCached(cacheKey, raw.data);

    return { success: true, country, total: 1, page: 1, data: raw.data };

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: "Failed to fetch details", details: message };
  }
}