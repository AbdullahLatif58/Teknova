 

export interface ProductFilters {
  categoryIds?: string[];
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "popular" | "price_low" | "price_high";
  search?: string;
}