import axiosClient from "@/utils/apiClient";
import { Product, ProductResponse } from "@/types/product";

export const getProducts = async (page = 1, limit = 20): Promise<ProductResponse<Product[]>> => {
  const res = await axiosClient.get<ProductResponse<Product[]>>(`/products?page=${page}&limit=${limit}`);
  // Map 'products' or 'data' for listing
  if (res.data && !res.data.products && res.data.data) {
    res.data.products = res.data.data;
  }
  return res.data;
};

export const searchProducts = async (query: string): Promise<ProductResponse<Product[]>> => {
  const res = await axiosClient.get<ProductResponse<Product[]>>(`/products/search?query=${encodeURIComponent(query)}`);
  // Map 'products' or 'data' for search
  if (res.data && !res.data.products && res.data.data) {
    res.data.products = res.data.data;
  }
  return res.data;
};

export const filterProducts = async (params: Record<string, any>): Promise<ProductResponse<Product[]>> => {
  const queryParams = new URLSearchParams(params).toString();
  const res = await axiosClient.get<ProductResponse<Product[]>>(`/products/filter?${queryParams}`);
  return res.data;
};

export const getFeaturedProducts = async (): Promise<ProductResponse<Product[]>> => {
  const res = await axiosClient.get<ProductResponse<Product[]>>("/products/featured");
  return res.data;
};

export const getNewProducts = async (): Promise<ProductResponse<Product[]>> => {
  const res = await axiosClient.get<ProductResponse<Product[]>>("/products/new");
  return res.data;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const res = await axiosClient.get<ProductResponse<Product>>(`/products/${encodeURIComponent(slug)}`);
    // Resilience: check for .product or .data
    // @ts-ignore - backend might return .product
    return res.data.product || res.data.data || null;
  } catch (err) {
    console.error(`Failed to fetch product with slug "${slug}":`, err);
    return null;
  }
};

const normalizeProductData = (data: Partial<Product>) => {
  const normalized: any = { ...data };
  
  if (normalized.is_active !== undefined) {
    normalized.is_active = normalized.is_active ? 1 : 0;
  }
  
  delete normalized.is_featured;
  delete normalized.is_new;
  delete normalized.image_url;
  delete normalized.id;
  delete normalized.created_at;
  delete normalized.updated_at;

  return normalized;
};

export const createProduct = async (data: Partial<Product>, imageFiles?: File[]): Promise<Product> => {
  const formData = new FormData();
  const normalized = normalizeProductData(data);
  
  Object.entries(normalized).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        value.forEach((val) => formData.append(`${key}[]`, val));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  if (normalized.title) formData.append("name", normalized.title);
  if (normalized.page_handle) formData.append("slug", normalized.page_handle);
  
  if (imageFiles?.length) {
    imageFiles.forEach((file) => formData.append("images", file));
  }

  const res = await axiosClient.post<ProductResponse<Product>>("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data!;
};

export const updateProduct = async (id: string, data: Partial<Product>, imageFiles?: File[]): Promise<Product> => {
  const formData = new FormData();
  const normalized = normalizeProductData(data);
  
  Object.entries(normalized).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        value.forEach((val) => formData.append(`${key}[]`, val));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  if (normalized.title) formData.append("name", normalized.title);
  if (normalized.page_handle) formData.append("slug", normalized.page_handle);

  if (imageFiles?.length) {
    imageFiles.forEach((file) => formData.append("images", file));
  }

  const res = await axiosClient.put<ProductResponse<Product>>(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data!;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const res = await axiosClient.delete<ProductResponse>(`/products/${id}`);
  return res.data.success;
};
