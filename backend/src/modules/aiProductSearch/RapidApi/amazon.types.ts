// amazon.types.ts

export interface AmazonProduct {
  asin: string;
  product_title: string;
  product_price: string;
  product_original_price: string | null;
  currency: string;
  product_star_rating: string | null;
  product_num_ratings: number;
  product_url: string;
  product_photo: string;
  product_num_offers: number | null;
  product_minimum_offer_price: string | null;
  is_best_seller: boolean;
  is_amazon_choice: boolean;
  is_prime: boolean;
  climate_pledge_friendly: boolean;
  sales_volume: string | null;
  delivery: string | null;
  // Details specific fields
  product_description?: string;
  product_details?: Record<string, string>;
  product_information?: Record<string, string>;
  product_photos?: string[];
  product_variations?: any;
}

export interface AmazonReview {
  review_id: string;
  review_title: string;
  review_description: string;
  review_star_rating: string;
  review_author: string;
  review_date: string;
  is_verified_purchase: boolean;
  review_images?: string[];
  review_video?: string;
}

export interface AmazonSearchParams {
  query: string;
  country?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  page?: number;
}

export interface AmazonProductDetailsParams {
  asin: string;
  country?: string;
}

export interface AmazonProductReviewsParams {
  asin: string;
  country?: string;
  sort_by?: "TOP_REVIEWS" | "MOST_RECENT";
  star_rating?: "ALL" | "1" | "2" | "3" | "4" | "5";
  verified_purchases_only?: boolean;
  page?: number;
}

export interface AmazonSearchResponse {
  status: string;
  data: {
    total_products: number;
    country: string;
    domain: string;
    products: AmazonProduct[];
  };
}

export interface AmazonReviewsResponse {
  status: string;
  data: {
    asin: string;
    total_reviews: number;
    star_rating_1: number;
    star_rating_2: number;
    star_rating_3: number;
    star_rating_4: number;
    star_rating_5: number;
    reviews: AmazonReview[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  country?: string;
  total?: number;
  page?: number;
  data?: T;
  error?: string;
  details?: string;
}