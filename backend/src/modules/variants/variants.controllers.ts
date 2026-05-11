// productVariant.controllers.ts
import { Request, Response } from "express";
import {
  createVariant,
  getVariantsByProduct,
  updateVariant,
  deleteVariant,
  createBulkVariants,
} from "./variants.services";
import { ProductVariant } from "./variants.model";
import { asyncHandler, AppError } from "../../utils/errors";


export const createVariantController = asyncHandler(async (req: Request, res: Response) => {
  const variantData: ProductVariant = req.body as any;
  const files = req.files as Express.Multer.File[];

  const variant = await createVariant(variantData, files);

  return res.status(201).json({ success: true, data: variant });
});


export const getVariantsController = asyncHandler(async (req: Request, res: Response) => {
  const product_id = Array.isArray(req.params.product_id)
    ? req.params.product_id[0]
    : req.params.product_id;

  const variants = await getVariantsByProduct(product_id);

  return res.status(200).json({
    success: true,
    data: variants
  });
});


export const updateVariantController = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const data: Partial<ProductVariant> = req.body;
  const files = req.files as Express.Multer.File[];

  const updatedVariant = await updateVariant(id, data, files);

  return res.status(200).json({ success: true, data: updatedVariant });
});


export const deleteVariantController = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const result = await deleteVariant(id);

  return res.status(200).json(result);
});

export const createBulkVariantsController = asyncHandler(async (req: Request, res: Response) => {
  const variants: ProductVariant[] = req.body.variants;

  if (!Array.isArray(variants)) {
    throw new AppError("Payload must contain an array of variants", 400, "INVALID_PAYLOAD");
  }

  const result = await createBulkVariants(variants);

  return res.status(201).json({ success: true, data: result });
});