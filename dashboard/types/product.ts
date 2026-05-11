export interface Product {
  id?: string;
  category_id: string;
  title: string;
  description?: string | null;
  page_title?: string | null;
  page_handle: string;
  images?: string[] | null;
  tags?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  price: number | string; // Backend sends string for price in some cases
  total_stock: number;
  is_active: number | boolean;
  specifications?: any;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductResponse<T = any> {
  success: boolean;
  data?: T; // For single product responses
  products?: T; // For list responses (as spread by controller)
  total?: number;
  page?: number;
  totalPages?: number;
  limit?: number;
  message?: string;
}
