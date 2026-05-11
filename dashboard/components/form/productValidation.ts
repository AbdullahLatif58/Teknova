import { Product } from "@/types/product";

export const validateProduct = (
  data: Partial<Product>,
  imageFiles: File[] | null,
  hasExistingImage: boolean
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 2) {
    errors.title = "Product title must be at least 2 characters long";
  }

  if (!data.page_handle || !/^[a-z0-9-]+$/.test(data.page_handle)) {
    errors.page_handle = "Slug must contain only lowercase letters, numbers, and hyphens";
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters long";
  }

  if (data.price === undefined || Number(data.price) < 0) {
    errors.price = "Price must be a positive number";
  }

  if (!data.category_id) {
    errors.category_id = "Please select a category";
  }

  if (!hasExistingImage && (!imageFiles || imageFiles.length === 0)) {
    errors.images = "At least one product image is required";
  }

  return errors;
};
