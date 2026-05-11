
import axiosClient from "@/utils/apiClient";
import { Category } from "@/types/category";
import { CategoryResponse } from "./types.dt";


export const getCategories = async (): Promise<Category[]> => {
  const res = await axiosClient.get<CategoryResponse<Category[]>>("/categories");
  return res.data.data;
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const res = await axiosClient.get<CategoryResponse<Category>>(
      `/categories/${encodeURIComponent(slug)}`
    );
    return res.data.data;
  } catch (err) {
    console.error(`Failed to fetch category with slug "${slug}":`, err);
    return null;
  }
};


export const createCategory = async (data: Partial<Category>, imageFile?: File): Promise<Category> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value as string);
  });
  if (imageFile) formData.append("image", imageFile);

  const res = await axiosClient.post<CategoryResponse<Category>>("/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};


export const updateCategory = async (
  id: string,
  data: Partial<Category>,
  imageFiles?: File[]
): Promise<Category> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value as string);
  });
  if (imageFiles?.length) {
    imageFiles.forEach((file) => formData.append("image", file));
  }

  const res = await axiosClient.put<CategoryResponse<Category>>(
    `/categories/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data.data;
};


export const deleteCategory = async (id: string): Promise<boolean> => {
  const res = await axiosClient.delete<CategoryResponse>(`/categories/${id}`);
  return res.data.success;
};