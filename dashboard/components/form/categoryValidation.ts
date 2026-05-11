import { Category } from '@/types/category';

export const validateCategory = (
  formData: Category,
  imageFile: File | null,
  hasExistingImage: boolean
): Record<string, string> => {
  const newErrors: Record<string, string> = {};


  if (!formData.name.trim()) {
    newErrors.name = 'Category name is required';
  }

  if (!formData.slug.trim()) {
    newErrors.slug = 'Slug is required';
  } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
    newErrors.slug = 'Slug must only contain lowercase letters, numbers, and hyphens';
  }

  if (!formData.description.trim()) {
    newErrors.description = 'Description is required';
  }

  // SEO Validation
  if (!formData.meta_title?.trim()) {
    newErrors.meta_title = 'Meta title is required for SEO';
  }

  if (!formData.meta_description?.trim()) {
    newErrors.meta_description = 'Meta description is required for SEO';
  }

  if (!formData.meta_keywords?.trim()) {
    newErrors.meta_keywords = 'At least one meta keyword is required';
  }

  // Image Validation
  // Required if it's a new category and no file is selected
  // If it's an edit, we check if there's either a new file or an existing image_url
  if (!imageFile && !hasExistingImage && !formData.image_url) {
    newErrors.image = 'Category image is required';
  }

  return newErrors;
};
