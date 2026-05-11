export interface ProductVariant {
  id?: string;
  product_id: string;
  title: string; // Used as 'name' for backend validation
  price: number | string;
  sku?: string | null;
  stock: number;
  image_url?: string | null;
  images?: string[] | null;
  is_default: boolean | number;
  is_active: boolean | number;
  specifications?: any;
  created_at?: string;
  updated_at?: string;
}

export interface VariantResponse<T = any> {
  success: boolean;
  data?: T;
  variants?: T;
  message?: string;
}
