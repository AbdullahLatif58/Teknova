import { Request, Response } from "express";
import * as reviewsService from "./reviews.services";
import { asyncHandler, AppError } from "../../utils/errors";

export const addReview = asyncHandler(async (req: Request, res: Response) => {
    const { productId, rating, comment, userId } = req.body;
    const uid = userId || req.headers['x-user-id'] || (req as any)?.user?.id;

    if (!uid) {
      throw new AppError("User ID required", 401, "AUTH_REQUIRED");
    }

    const review = await reviewsService.createReview(productId, uid, rating, comment);
    return res.status(201).json({ success: true, data: review });
});

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    if (!productId) {
      throw new AppError("productId parameter required", 400, "MISSING_PARAMETER");
    }

    const reviews = await reviewsService.getReviewsForProduct(productId as string);
    return res.status(200).json({ success: true, data: reviews });
});

export const removeReview = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new AppError("Review ID required", 400, "MISSING_PARAMETER");
    
    await reviewsService.deleteReview(id as string);
    return res.status(200).json({ success: true, message: "Review deleted" });
});
