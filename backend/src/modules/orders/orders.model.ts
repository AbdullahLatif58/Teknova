export interface OrderItem {
   id: string;                       
   order_id: string;                 
   product_id: string;              
   variant_id?: string | null;       
   quantity: number;
   unit_price: number;              
   discount_type?: "percentage" | "fixed" | null;
   discount_value?: number | null;
   final_price: number;             
   created_at: Date;
   updated_at: Date;
 }

 export interface Order {
   id: string;                       
   user_id?: string | null;          
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
   is_paid: boolean;
   created_at: Date;
   updated_at: Date;
 }
