
import express from "express";
import multer from "multer";
import {
  createVariantController,
  getVariantsController,
  updateVariantController,
  deleteVariantController,
  createBulkVariantsController,
} from "./variants.controllers";
import { body } from "express-validator";
import { validate } from "../../utils/validation";

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/bulk", createBulkVariantsController);
router.post(
  "/", 
  upload.array("images"), 
  validate([
    body("product_id").notEmpty().withMessage("Product ID is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ]),
  createVariantController
);


router.get("/:product_id", getVariantsController);


router.put(
  "/:id", 
  upload.array("images"), 
  validate([
    body("price").optional().isNumeric().withMessage("Price must be a number"),
  ]),
  updateVariantController
);


router.delete("/:id", deleteVariantController);

export default router;