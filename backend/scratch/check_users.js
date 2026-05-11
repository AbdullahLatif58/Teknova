const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkColumns() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [rows] = await connection.query('DESCRIBE users');
  console.log(rows.map(r => r.Field));
  await connection.end();
}

checkColumns();
