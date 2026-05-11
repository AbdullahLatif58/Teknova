import { pool } from '../config/db';

async function run() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS promo_codes (
        id VARCHAR(36) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        discount_type ENUM('percentage', 'fixed') NOT NULL,
        discount_value DECIMAL(10,2) NOT NULL,
        max_uses INT NULL,
        current_uses INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        expires_at DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;
    await pool.query(query);
    console.log('Successfully created promo_codes table.');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    process.exit(0);
  }
}

run();
