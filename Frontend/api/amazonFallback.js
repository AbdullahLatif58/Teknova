// Static fallback data for when the Amazon API is unavailable (rate-limited/quota exceeded).
// This is the exact Postman response data saved for the homepage AI picks section.
// When the API is working, live data will replace this automatically.

export const AMAZON_FALLBACK_DATA = [
  {
    asin: "B07ZPKN6YR",
    product_title: "Apple iPhone 11, 64GB, Black - Unlocked (Renewed)",
    product_price: "$179.00",
    product_original_price: null,
    currency: "USD",
    product_star_rating: "4.2",
    product_num_ratings: 60081,
    product_url: "https://www.amazon.com/dp/B07ZPKN6YR",
    product_photo: "https://m.media-amazon.com/images/I/61MG3m5FhIL._AC_UY654_QL65_.jpg",
    is_best_seller: false,
    is_amazon_choice: false,
    is_prime: true,
    sales_volume: "1K+ bought in past month",
    has_variations: true
  },
  {
    asin: "B07ZPKF8RG",
    product_title: "Apple iPhone 11, 64GB, Purple - Unlocked (Renewed)",
    product_price: "$179.56",
    product_original_price: "$222.60",
    currency: "USD",
    product_star_rating: "4.2",
    product_num_ratings: 60081,
    product_url: "https://www.amazon.com/dp/B07ZPKF8RG",
    product_photo: "https://m.media-amazon.com/images/I/51U8WCTTmCL._AC_UY654_QL65_.jpg",
    is_best_seller: false,
    is_amazon_choice: false,
    is_prime: true,
    sales_volume: "300+ bought in past month",
    has_variations: true
  },
  {
    asin: "B07ZPKR714",
    product_title: "Apple iPhone 11, 128GB, Black - Unlocked (Renewed)",
    product_price: "$189.99",
    product_original_price: null,
    currency: "USD",
    product_star_rating: "4.2",
    product_num_ratings: 60081,
    product_url: "https://www.amazon.com/dp/B07ZPKR714",
    product_photo: "https://m.media-amazon.com/images/I/61Y3GhJ3PRL._AC_UY654_QL65_.jpg",
    is_best_seller: false,
    is_amazon_choice: false,
    is_prime: false,
    product_availability: "Only 5 left in stock - order soon.",
    sales_volume: "400+ bought in past month",
    has_variations: true
  }
];

export function mapAmazonProducts(rawProducts) {
  return rawProducts.map(p => ({
    id: p.asin,
    // Amazon product links open on Amazon directly
    slug: p.product_url || `https://www.amazon.com/dp/${p.asin}`,
    name: p.product_title,
    price: parseFloat(p.product_price?.replace(/[^0-9.]/g, '')) || 0,
    compareAt: p.product_original_price
      ? parseFloat(p.product_original_price.replace(/[^0-9.]/g, ''))
      : null,
    image: p.product_photo || 'https://placehold.co/600x600',
    brand: 'Amazon',
    rating: parseFloat(p.product_star_rating) || 4.5,
    reviewCount: p.product_num_ratings || 0,
    isPrime: p.is_prime,
    salesVolume: p.sales_volume,
    category: 'AI Suggestion',
    isAmazonProduct: true,
  }));
}
