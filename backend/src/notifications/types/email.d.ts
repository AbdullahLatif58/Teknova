export interface EmailJob {
   to: string;
   subject: string;
   template: 'signup' | 'forgetPassword' | 'orderConfirmation';
   context: Record<string, any>; 
 }