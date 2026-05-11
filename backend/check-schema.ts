import { pool } from "./src/config/db";

async function checkSchema() {
  const [tables] = await pool.query("SHOW TABLES");
  console.log("TABLES:", tables);

  const [users] = await pool.query("DESCRIBE users");
  console.log("\nUSERS SCHEMA:", users);
  
  const [products] = await pool.query("DESCRIBE products");
  console.log("\nPRODUCTS SCHEMA:", products);

  process.exit(0);
}

checkSchema();
