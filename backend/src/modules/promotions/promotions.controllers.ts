import { Request, Response } from "express";
import { asyncHandler, AppError } from "../../utils/errors";
import * as promoServices from "./promotions.services";

export const createPromoController = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const id = await promoServices.createPromoCode(data);

  return res.status(201).json({
    success: true,
    message: "Promo code created successfully",
    data: { id }
  });
});

export const getPromosController = asyncHandler(async (req: Request, res: Response) => {
  const promos = await promoServices.getPromoCodes();
  return res.status(200).json({
    success: true,
    data: promos
  });
});

export const validatePromoController = asyncHandler(async (req: Request, res: Response) => {
  const { code, totalAmount } = req.body;

  if (!code || typeof totalAmount !== "number") {
    throw new AppError("Promo code and totalAmount are required", 400, "INVALID_PAYLOAD");
  }

  const result = await promoServices.validatePromoCode(code, totalAmount);
  
  if (!result.valid) {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }

  return res.status(200).json({
    success: true,
    discount: result.discount,
    message: "Promo code evaluated successfully"
  });
});
