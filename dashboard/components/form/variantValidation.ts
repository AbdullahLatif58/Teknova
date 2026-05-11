import { ProductVariant } from "@/types/variant";

export const validateVariant = (
  data: Partial<ProductVariant>,
  imageFiles: File[] | null,
  hasExistingImage: boolean
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.product_id) {
    errors.product_id = "A product context must be linked";
  }


  if (data.price === undefined || Number(data.price) < 0) {
    errors.price = "Price must be a positive number";
  }

  if (data.stock === undefined || Number(data.stock) < 0) {
    errors.stock = "Stock cannot be negative";
  }

  if (!hasExistingImage && (!imageFiles || imageFiles.length === 0)) {
    errors.images = "At least one variant image is required if no existing image is present";
  }

  return errors;
};
