import { pool } from "../../config/db";

export async function getDashboardSummary() {
  // Total Revenue (completed orders)
  const [revRows]: any = await pool.query(
    `SELECT SUM(total_amount) as total_revenue FROM orders WHERE status = 'completed'`
  );

  // Total Orders
  const [orderRows]: any = await pool.query(`SELECT COUNT(*) as total_orders FROM orders`);

  // Active Products
  const [productRows]: any = await pool.query(`SELECT COUNT(*) as active_products FROM products WHERE is_active = 1`);

  // Total Users
  const [userRows]: any = await pool.query(`SELECT COUNT(*) as total_users FROM users`);

  return {
    totalRevenue: revRows[0]?.total_revenue || 0,
    totalOrders: orderRows[0]?.total_orders || 0,
    activeProducts: productRows[0]?.active_products || 0,
    totalUsers: userRows[0]?.total_users || 0,
  };
}

export async function getRecentOrders(limit: number = 5) {
  const [rows] = await pool.query(
    `SELECT id, customer_name as customer, total_amount as amount, status, created_at 
     FROM orders 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [limit]
  );
  return rows;
}

export async function getSalesChartData(days: number = 7) {
  // We group by DATE(created_at)
  // For MySQL, we can use DATE() function
  const [rows] = await pool.query(
    `SELECT DATE(created_at) as date, SUM(total_amount) as revenue 
     FROM orders 
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       AND status = 'completed'
     GROUP BY DATE(created_at)
     ORDER BY DATE(created_at) ASC`,
    [days]
  );
  return rows;
}

export async function getActivityFeed(limit: number = 5) {
  const [rows]: any = await pool.query(
    `SELECT method, api_endpoint, status_code, timestamp 
     FROM logs 
     WHERE method IN ('POST', 'PUT', 'DELETE') 
     ORDER BY timestamp DESC 
     LIMIT ?`,
    [limit]
  );

  return rows.map((log: any) => {
    let action = "performed an action";
    let entity = "System";

    if (log.api_endpoint.includes('/products')) {
      action = log.method === 'POST' ? 'added new Product' : 'updated a Product';
    } else if (log.api_endpoint.includes('/orders')) {
      action = 'placed an Order';
      entity = 'Customer';
    } else if (log.api_endpoint.includes('/amazon')) {
      action = 'synced API Products';
    }

    return {
      message: `${entity} ${action}`,
      timestamp: log.timestamp,
      status: log.status_code
    };
  });
}

export async function getApiLogs(limit: number = 50) {
  const [rows] = await pool.query(
    `SELECT id, method, api_endpoint, status_code, type, timestamp, extra 
         FROM logs 
         ORDER BY timestamp DESC 
         LIMIT ?`,
    [limit]
  );
  return rows;
}
