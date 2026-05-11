import { Router } from "express";
import {
  createPromoController,
  getPromosController,
  validatePromoController
} from "./promotions.controllers";
import { body } from "express-validator";
import { validate } from "../../utils/validation";
// Assuming auth middlewares exist for admin role here
// import { authenticate, authorizeRole } from "../auth/auth.middleware";

const router = Router();

// Endpoint for frontend to validate cart discount
router.post(
  "/validate",
  validate([
    body("code").notEmpty().withMessage("Promo code is required"),
    body("totalAmount").isNumeric().withMessage("totalAmount is required and must be a number"),
  ]),
  validatePromoController
);

// Admin endpoints
router.post(
  "/",
  // authenticate, authorizeRole("admin"),
  validate([
    body("code").notEmpty().withMessage("Code is required"),
    body("discount_type").isIn(["percentage", "fixed"]).withMessage("Invalid discount_type"),
    body("discount_value").isNumeric().withMessage("discount_value must be a number"),
  ]),
  createPromoController
);

router.get("/", getPromosController);

export default router;
