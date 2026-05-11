
export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active?: boolean | number;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;

  
  image_url?: string | null;
}