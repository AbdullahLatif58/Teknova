export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id?: number | null;
  quantity: number;
  unit_price: number;
  discount_type?: "percentage" | "fixed" | null;
  discount_value?: number | null;
  final_price: number;
  product_name?: string;
  variant_sku?: string;
  image_url?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface Order {
  id: number;
  user_id?: number | null;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  total_amount: number;
  original_amount: number;
  discount_amount: number;
  payment_method: "cash" | "card" | "wallet" | "online";
  shipping_address: string;
  billing_address: string;
  is_paid: boolean | number;
  order_items?: OrderItem[];
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface OrderResponse<T = any> {
  success: boolean;
  data?: T;
  orders?: T;
  message?: string;
  pagination?: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}
