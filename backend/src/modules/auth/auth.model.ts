export interface User {
   id: string;
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
   id: string;
   user_id: string;
   reset_token: string;
   expires_at: Date;
   used: boolean;
   created_at: Date;
 }
 
 export interface UserSession {
   id: string;
   user_id: string;
   device_info: string;
   ip_address: string;
   refresh_token: string;
   logged_in_at: Date;
   expires_at: Date;
   is_active: boolean;
 }