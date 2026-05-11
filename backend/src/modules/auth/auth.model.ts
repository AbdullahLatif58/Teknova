export interface User {
   id: number;
   name: string;
   email: string;
   password_hash: string;
   role: string;
   settings?: any | null;
   is_active: boolean;
   created_at: Date;
   updated_at: Date;
 }
 
 export interface PasswordReset {
   id: number;
   user_id: number;
   reset_token: string;
   expires_at: Date;
   used: boolean;
   created_at: Date;
 }
 
 export interface UserSession {
   id: number;
   user_id: number;
   device_info: string;
   ip_address: string;
   refresh_token: string;
   logged_in_at: Date;
   expires_at: Date;
   is_active: boolean;
 }