import { Router } from "express";
import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  cancelOrderController,
} from "./orders.controllers";
import { body } from "express-validator";
import { validate } from "../../utils/validation";

const router = Router();




router.get("/", getOrdersController);

router.get("/:id", getOrderByIdController);

router.post(
  "/", 
  validate([
    body("customer_name").notEmpty().withMessage("Customer name is required"),
    body("customer_email").isEmail().withMessage("Invalid customer email"),
    body("items").isArray({ min: 1 }).withMessage("Order must have at least one item"),
  ]),
  createOrderController
);

router.put(
  "/:id/status", 
  validate([
    body("status").notEmpty().withMessage("Status is required"),
  ]),
  updateOrderStatusController
);

router.put("/:id/cancel", cancelOrderController);

export default router;