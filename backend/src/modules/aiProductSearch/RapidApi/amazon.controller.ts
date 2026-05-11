// amazon.controller.ts

import { Request, Response } from 'express';
import { searchProducts, getProductDetails } from './amazon.search';
import { ApiResponse, AmazonSearchParams, AmazonProduct } from './amazon.types';

// Controller to handle product search and details fetching
export async function getProductsWithDetails(req: Request, res: Response) {
  const query = req.query.q as string;
  if (!query) {
    return res.status(400).json({ success: false, error: 'Missing query parameter ?q=your+product' });
  }

  const params: AmazonSearchParams = {
    query,
    country: req.query.country as string || 'PK',
  };

  try {
    // First, search for products
    const searchResult = await searchProducts(params);

    if (!searchResult.success) {
      return res.status(502).json(searchResult);
    }

    // Return the search results directly. 
    // We no longer fetch full details for each item here to ensure maximum speed and minimal payload.
    return res.status(200).json({ 
      success: true, 
      count: searchResult.data?.length || 0,
      data: searchResult.data 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ success: false, error: errorMessage });
  }
}