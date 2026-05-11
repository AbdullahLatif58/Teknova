import { Router } from "express";
import multer from "multer";
import {
  getProductsController,
  getProductBySlugController,
  createProductController,
  updateProductController,
  deleteProductController,
  getProductsByCategoryController,
  getFeaturedProductsController,
  getNewProductsController,
  filterProductsController,
  searchProductsController,
  createBulkProductsController
} from "./product.controller";

const router = Router();
import { body } from "express-validator";
import { validate } from "../../utils/validation";
const upload = multer(); 


router.get("/", getProductsController);
router.get("/featured", getFeaturedProductsController);
router.get("/new", getNewProductsController);
router.get("/filter", filterProductsController);
router.get("/category", getProductsByCategoryController);
router.get("/search", searchProductsController);
router.get("/:page_handle", getProductBySlugController);



router.post("/bulk", createBulkProductsController);
router.post(
  "/", 
  upload.array("images"), 
  validate([
    body("name").notEmpty().withMessage("Product name is required"),
    body("slug").notEmpty().withMessage("Product slug is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("category_id").notEmpty().withMessage("Category is required"),
  ]),
  createProductController
);
router.put(
  "/:id", 
  upload.array("images"), 
  validate([
    body("name").optional().notEmpty().withMessage("Product name cannot be empty"),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
  ]),
  updateProductController
);
router.delete("/:id", deleteProductController);

export default router;