
import { Router } from "express";
import * as categoryController from "./category.controller";
import { storeWithMulter } from "../../utils/multer"; 
import { body } from "express-validator";
import { validate } from "../../utils/validation";

const router = Router();


const upload = storeWithMulter("categories");


router.get("/", categoryController.listCategoriesController);


router.get("/:slug", categoryController.getCategoryBySlugController);


router.post("/bulk", categoryController.createBulkCategoriesController);
router.post(
  "/",
  upload.single("image"),
  validate([
    body("name").notEmpty().withMessage("Category name is required"),
    body("slug").notEmpty().withMessage("Category slug is required"),
  ]),
  categoryController.createCategoryController
);



router.put(
  "/:id",
  upload.array("image", 1),
  validate([
    body("name").optional().notEmpty().withMessage("Category name cannot be empty"),
    body("slug").optional().notEmpty().withMessage("Category slug cannot be empty"),
  ]),
  categoryController.updateCategoryController
);


router.delete("/:id", categoryController.deleteCategoryController);

export default router;