import { Router } from "express";
import { addReview, getProductReviews, removeReview } from "./reviews.controller";
import { body } from "express-validator";
import { validate } from "../../utils/validation";

const router = Router();

router.post(
  "/", 
  validate([
    body("product_id").notEmpty().withMessage("Product ID is required"),
    body("user_id").notEmpty().withMessage("User ID is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment").optional().isString().withMessage("Comment must be a string"),
  ]),
  addReview
);
router.get("/product/:productId", getProductReviews);
router.delete("/:id", removeReview);

export default router;
