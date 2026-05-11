import axiosClient from "@/utils/apiClient";
import { ProductVariant, VariantResponse } from "@/types/variant";

export const getVariants = async (productId: string): Promise<VariantResponse<ProductVariant[]>> => {
  const res = await axiosClient.get<VariantResponse<ProductVariant[]>>(`/variants/${productId}`);
  
  // Resilient mapping for variants
  const rawVariants = res.data.variants || res.data.data;
  
  if (Array.isArray(rawVariants)) {
    const mapped = rawVariants.map((v: any) => ({
      ...v,
      title: v.title || v.name || 'Unnamed Configuration'
    }));
    
    // Update the response object so the UI sees it
    if (res.data.variants) res.data.variants = mapped;
    if (res.data.data) res.data.data = mapped;
    // @ts-ignore - backend might use 'variants'
    if (!res.data.variants && !res.data.data) res.data.variants = mapped;
  }
  
  return res.data;
};

const normalizeVariantData = (data: Partial<ProductVariant>) => {
  const normalized: any = { ...data };
  
  // Convert boolean to integer for MySQL compatibility (is_active, is_default)
  if (normalized.is_active !== undefined) {
    normalized.is_active = normalized.is_active ? 1 : 0;
  }
  if (normalized.is_default !== undefined) {
    normalized.is_default = normalized.is_default ? 1 : 0;
  }
  
  // Strict cleanup: only allow fields in the current DB schema
  const allowedFields = [
    'product_id', 'price', 'sku', 'stock', 
    'is_default', 'is_active', 'specifications'
  ];

  const result: any = {};
  allowedFields.forEach(field => {
    if (normalized[field] !== undefined) {
      result[field] = normalized[field];
    }
  });

  // Ensure title maps to name for backend validation
  if (normalized.title) {
    result.name = normalized.title;
  }

  return result;
};

export const createVariant = async (data: Partial<ProductVariant>, imageFiles?: File[]): Promise<ProductVariant> => {
  const formData = new FormData();
  const normalized = normalizeVariantData(data);
  
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

  if (imageFiles?.length) {
    imageFiles.forEach((file) => formData.append("images", file));
  }

  const res = await axiosClient.post<VariantResponse<ProductVariant>>("/variants", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data!;
};

export const updateVariant = async (id: string, data: Partial<ProductVariant>, imageFiles?: File[]): Promise<ProductVariant> => {
  const formData = new FormData();
  const normalized = normalizeVariantData(data);
  
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

  if (imageFiles?.length) {
    imageFiles.forEach((file) => formData.append("images", file));
  }

  const res = await axiosClient.put<VariantResponse<ProductVariant>>(`/variants/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data!;
};

export const deleteVariant = async (id: string): Promise<boolean> => {
  const res = await axiosClient.delete<VariantResponse>(`/variants/${id}`);
  return res.data.success;
};

export const createBulkVariants = async (variants: Partial<ProductVariant>[]): Promise<VariantResponse> => {
  const res = await axiosClient.post<VariantResponse>("/variants/bulk", { variants });
  return res.data;
};
