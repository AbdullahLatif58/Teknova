export interface Category {
  id: number;
  name: string;
  slug: string;
  parentCategory: string | null;
  productCount: number;
  status: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  price: number;
  stock: number;
  source: string;
  status: string;
}

export interface Variant {
  id: number;
  type: string;
  options: string[];
  productId: number;
  productName: string;
}

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  payment: string;
  status: string;
  date: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  orders: number;
  joined: string;
  status: string;
  color: string;
}

export interface Log {
  id: number;
  logId: string;
  apiSource: string;
  productFetched: string;
  status: string;
  responseTime: string;
  timestamp: string;
}

export interface ChartDataPoint {
  name: string;
  revenue: number;
}

export interface ProductMixItem {
  name: string;
  value: number;
  color: string;
}
