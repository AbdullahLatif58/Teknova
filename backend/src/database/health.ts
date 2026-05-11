import { pool } from "../config/db";

export const checkDatabaseConnection = async (): Promise<boolean> => {
   try{
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      return true;

   }catch(err: any){
      console.error("Database connection Failed:", err.message);
      return false;
   }
}