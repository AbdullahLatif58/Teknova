// app/api/categories/types.ts

export interface Category {
   id: string;
   name: string;
   slug: string;
   description?: string;
   image?: string; // URL of uploaded image
 }
 
 export interface CategoryResponse<T = Category> {
   success: boolean;
   message?: string;
   data: T;
   count?: number; // for list endpoint
 }