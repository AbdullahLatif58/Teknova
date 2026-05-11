export interface Category {
   id?: string;
   name: string;
   slug: string;
   description: string;
   is_active: 0 | 1;
   meta_title?: string;
   meta_description?: string;
   meta_keywords?: string; // comma-separated
   image_url?: string;
   created_at?: string;
   updated_at?: string;
 }