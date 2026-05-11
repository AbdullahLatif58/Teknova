
export interface ProductVariant {
  id: string;
  product_id: string;
  price: number;
  sku?: string | null;
  stock: number;
  image_url?: string | null;
  is_default: boolean;

  is_active: boolean;
  specifications?: any;
  created_at?: Date;
  updated_at?: Date;
}
