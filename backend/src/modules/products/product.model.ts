export interface Product {
  id: string;
  category_id: string;
  title: string;
  description?: string | null;
  page_handle: string;
  images?: string[] | null;
  tags?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  price: number;
  total_stock: number;
  is_active: boolean;
  specifications?: any;
  created_at?: Date;
  updated_at?: Date;
}


export interface ProductFilters {
  categoryIds?: string[];
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "popular" | "price_low" | "price_high";
  search?: string;
}