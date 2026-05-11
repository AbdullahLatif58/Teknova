import type { Category, Product, Variant, Order, User, Log, ChartDataPoint, ProductMixItem } from '@/types';

export const dummyCategories: Category[] = [
  { id: 1, name: "Electronics", slug: "electronics", parentCategory: null, productCount: 85, status: 'Active' },
  { id: 2, name: "Clothing", slug: "clothing", parentCategory: null, productCount: 120, status: 'Active' },
  { id: 3, name: "Footwear", slug: "footwear", parentCategory: "Clothing", productCount: 45, status: 'Active' },
  { id: 4, name: "Mobile", slug: "mobile", parentCategory: "Electronics", productCount: 60, status: 'Active' },
  { id: 5, name: "Accessories", slug: "accessories", parentCategory: null, productCount: 78, status: 'Active' },
  { id: 6, name: "Home & Living", slug: "home-living", parentCategory: null, productCount: 95, status: 'Active' },
];

export const dummyProducts: Product[] = [
  { id: 1, name: "Nike Air Max 270", sku: "NK-AM270", categoryId: 3, price: 129.99, stock: 45, source: "Local", status: "Active" },
  { id: 2, name: "Apple iPhone 15 Pro", sku: "AP-IP15P", categoryId: 4, price: 999.00, stock: 12, source: "API", status: "Active" },
  { id: 3, name: "Samsung 4K Smart TV", sku: "SM-4KTV", categoryId: 1, price: 799.00, stock: 8, source: "Local", status: "Active" },
  { id: 4, name: "Levi's 501 Jeans", sku: "LV-501J", categoryId: 2, price: 79.99, stock: 67, source: "Local", status: "Active" },
  { id: 5, name: "Sony WH-1000XM5 Headphones", sku: "SN-WH5", categoryId: 1, price: 349.00, stock: 23, source: "API", status: "Active" },
  { id: 6, name: "Adidas Ultraboost 22", sku: "AD-UB22", categoryId: 3, price: 189.99, stock: 31, source: "Local", status: "Active" },
  { id: 7, name: "Apple Watch Series 9", sku: "AP-WS9", categoryId: 5, price: 399.00, stock: 5, source: "API", status: "Active" },
  { id: 8, name: "Dyson V15 Vacuum", sku: "DY-V15", categoryId: 6, price: 649.00, stock: 14, source: "Local", status: "Active" },
  { id: 9, name: "OnePlus 12", sku: "OP-12", categoryId: 4, price: 699.00, stock: 28, source: "Local", status: "Active" },
  { id: 10, name: "Ray-Ban Aviator Sunglasses", sku: "RB-AV", categoryId: 5, price: 189.00, stock: 52, source: "Local", status: "Active" },
];

export const dummyVariants: Variant[] = [
  { id: 1, type: "Size", options: ["XS", "S", "M", "L", "XL"], productId: 1, productName: "Nike Air Max 270" },
  { id: 2, type: "Color", options: ["Red", "Blue", "Black", "White"], productId: 1, productName: "Nike Air Max 270" },
  { id: 3, type: "Size", options: ["28", "30", "32", "34", "36"], productId: 4, productName: "Levi's 501 Jeans" },
  { id: 4, type: "Color", options: ["Indigo", "Black", "Grey"], productId: 4, productName: "Levi's 501 Jeans" },
  { id: 5, type: "Storage", options: ["128GB", "256GB", "512GB", "1TB"], productId: 2, productName: "Apple iPhone 15 Pro" },
  { id: 6, type: "Color", options: ["Natural Titanium", "Blue Titanium", "White"], productId: 2, productName: "Apple iPhone 15 Pro" },
  { id: 7, type: "Size", options: ["UK6", "UK7", "UK8", "UK9", "UK10"], productId: 6, productName: "Adidas Ultraboost 22" },
  { id: 8, type: "Material", options: ["Plastic", "Metal", "Wood"], productId: 8, productName: "Dyson V15 Vacuum" },
];

export const dummyOrders: Order[] = [
  { id: "#TKV-0041", customer: "Ali Hassan", items: 3, total: 329.97, payment: "Paid", status: "Delivered", date: "2024-01-15" },
  { id: "#TKV-0042", customer: "Sara Khan", items: 1, total: 999.00, payment: "Paid", status: "Processing", date: "2024-01-16" },
  { id: "#TKV-0043", customer: "Muhammad Usman", items: 2, total: 269.98, payment: "Pending", status: "Pending", date: "2024-01-17" },
  { id: "#TKV-0044", customer: "Ayesha Malik", items: 1, total: 799.00, payment: "Paid", status: "Shipped", date: "2024-01-18" },
  { id: "#TKV-0045", customer: "Bilal Ahmed", items: 4, total: 558.96, payment: "Paid", status: "Delivered", date: "2024-01-19" },
  { id: "#TKV-0046", customer: "Fatima Zahra", items: 2, total: 538.99, payment: "Failed", status: "Cancelled", date: "2024-01-20" },
  { id: "#TKV-0047", customer: "Hassan Ali", items: 1, total: 349.00, payment: "Paid", status: "Shipped", date: "2024-01-21" },
  { id: "#TKV-0048", customer: "Zara Noor", items: 3, total: 457.97, payment: "Paid", status: "Processing", date: "2024-01-22" },
  { id: "#TKV-0049", customer: "Omar Sheikh", items: 1, total: 189.99, payment: "Pending", status: "Pending", date: "2024-01-23" },
  { id: "#TKV-0050", customer: "Mariam Tariq", items: 2, total: 588.00, payment: "Paid", status: "Delivered", date: "2024-01-24" },
];

export const dummyUsers: User[] = [
  { id: 1, name: "Ali Hassan", email: "ali@teknova.com", role: "Admin", orders: 0, joined: "2023-06-01", status: "Active", color: "bg-violet-600" },
  { id: 2, name: "Sara Khan", email: "sara@gmail.com", role: "Customer", orders: 5, joined: "2023-08-15", status: "Active", color: "bg-blue-600" },
  { id: 3, name: "Muhammad Usman", email: "usman@gmail.com", role: "Customer", orders: 3, joined: "2023-09-20", status: "Active", color: "bg-emerald-600" },
  { id: 4, name: "Ayesha Malik", email: "ayesha@gmail.com", role: "Customer", orders: 7, joined: "2023-10-05", status: "Active", color: "bg-amber-600" },
  { id: 5, name: "Bilal Ahmed", email: "bilal@teknova.com", role: "Admin", orders: 0, joined: "2023-06-01", status: "Active", color: "bg-indigo-600" },
  { id: 6, name: "Fatima Zahra", email: "fatima@gmail.com", role: "Customer", orders: 2, joined: "2023-11-12", status: "Suspended", color: "bg-rose-600" },
  { id: 7, name: "Hassan Ali", email: "hassan@gmail.com", role: "Customer", orders: 1, joined: "2023-12-01", status: "Active", color: "bg-cyan-600" },
  { id: 8, name: "Zara Noor", email: "zara@gmail.com", role: "Customer", orders: 8, joined: "2024-01-05", status: "Active", color: "bg-teal-600" },
];

export const dummyLogs: Log[] = [
  { id: 1, logId: "LOG-8821", apiSource: "Amazon Product API", productFetched: "Nike Air Max 270", status: "Success", responseTime: "320ms", timestamp: "2024-01-24 10:20:15" },
  { id: 2, logId: "LOG-8822", apiSource: "eBay Search API", productFetched: "Apple iPhone 15", status: "Failed", responseTime: "1240ms", timestamp: "2024-01-24 10:22:10" },
  { id: 3, logId: "LOG-8823", apiSource: "Walmart Open API", productFetched: "Sony WH-1000XM5", status: "Timeout", responseTime: "5000ms", timestamp: "2024-01-24 10:25:05" },
];

export const CHART_DATA: ChartDataPoint[] = [
  { name: 'Mon', revenue: 4200 },
  { name: 'Tue', revenue: 3800 },
  { name: 'Wed', revenue: 5100 },
  { name: 'Thu', revenue: 4800 },
  { name: 'Fri', revenue: 6200 },
  { name: 'Sat', revenue: 7500 },
  { name: 'Sun', revenue: 6800 },
];

export const PRODUCTS_MIX: ProductMixItem[] = [
  { name: 'Local Store', value: 68, color: '#7c3aed' },
  { name: 'API Source', value: 32, color: '#3b82f6' },
];
