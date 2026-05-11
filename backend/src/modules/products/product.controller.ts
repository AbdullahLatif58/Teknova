import { Request, Response } from "express";
import {
    getAllProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductByCategory,
    getFeaturedProducts,
    getNewProducts,
    filterProducts,
    searchProducts,
    createBulkProducts
} from "./product.services";
import { Product } from "./product.model";
import { asyncHandler, AppError } from "../../utils/errors";


export const getProductsController = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await getAllProducts(page, limit);

    return res.status(200).json({ success: true, ...result });
});


export const getProductBySlugController = asyncHandler(async (req: Request, res: Response) => {
    const slug = Array.isArray(req.params.page_handle) ? req.params.page_handle[0] : req.params.page_handle;

    const product = await getProductBySlug(slug);
    if (!product) throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");

    return res.status(200).json({ success: true, data: product });
});


export const getProductsByCategoryController = asyncHandler(async (req: Request, res: Response) => {
    const category_id = req.query.category_id as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!category_id) {
        throw new AppError("category_id is required", 400, "MISSING_PARAMETER");
    }

    const products = await getProductByCategory(category_id, page, limit);

    return res.status(200).json({ success: true, data: products });
});

export const getFeaturedProductsController = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;

    const products = await getFeaturedProducts(limit);

    return res.status(200).json({ success: true, data: products });
});

export const getNewProductsController = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;

    const products = await getNewProducts(limit);

    return res.status(200).json({ success: true, data: products });
});

export const filterProductsController = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
        categoryIds: req.query.category_id ? [req.query.category_id as string] : undefined,
        tags: req.query.tags ? (req.query.tags as string).split(",") : undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        sortBy: req.query.sortBy as any,
        search: req.query.search as string,
    };

    const products = await filterProducts(filters);

    return res.status(200).json({ success: true, data: products });
});

export const searchProductsController = asyncHandler(async (req: Request, res: Response) => {
    const query = (req.query.query as string)?.trim();
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;

    if (!query) {
        throw new AppError("Search query is required", 400, "MISSING_PARAMETER");
    }

    const products = await searchProducts(query, limit, page);

    return res.status(200).json({ success: true, data: products });
});

export const createProductController = asyncHandler(async (req: Request, res: Response) => {
    const productData: Product = req.body;
    const files = req.files as Express.Multer.File[];

    const product = await createProduct(productData, files);

    return res.status(201).json({ success: true, data: product });
});


export const updateProductController = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data: Partial<Product> = req.body;
    const files = req.files as Express.Multer.File[];

    const updatedProduct = await updateProduct(id, data, files);

    return res.status(200).json({ success: true, data: updatedProduct });
});


export const deleteProductController = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const result = await deleteProduct(id);

    return res.status(200).json(result);
});

export const createBulkProductsController = asyncHandler(async (req: Request, res: Response) => {
    const products: Product[] = req.body.products;

    if (!Array.isArray(products)) {
        throw new AppError("Payload must contain an array of products", 400, "INVALID_PAYLOAD");
    }

    const result = await createBulkProducts(products);

    return res.status(201).json({ success: true, data: result });
});





