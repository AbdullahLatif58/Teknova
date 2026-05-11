export interface PromoCode {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses?: number | null;
  current_uses: number;
  is_active: boolean;
  expires_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}
