
import { Request, Response } from "express";
import * as categoryService from "./category.services";
import fs from "fs";
import path from "path";
import { Category } from "./category.model";
import { withBaseUrl } from "../../utils/url";
import { asyncHandler, AppError } from "../../utils/errors";

export const listCategoriesController = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoryService.getAllCategory();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
});


export const getCategoryBySlugController = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    if (typeof slug !== "string") {
      throw new AppError("Invalid slug parameter", 400, "INVALID_PARAMETER");
    }
    const category = await categoryService.getBySlug(slug);
    if (!category) throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND");

    res.status(200).json({ success: true, data: category });
});



export const createCategoryController = asyncHandler(async (req: Request, res: Response) => {
    const categoryData: Category = req.body;
    const imageFile = (req.file as Express.Multer.File) || undefined;

    const result = await categoryService.createCategory(categoryData, imageFile);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
});


export const updateCategoryController = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data: Partial<Category> = req.body;
    const newImageFiles = req.files as Express.Multer.File[] | undefined;

    const updatedCategory = await categoryService.updateCategoryService(id, data, newImageFiles);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
});


export const deleteCategoryController = asyncHandler(async (req: Request, res: Response) => {
     const id = req.params.id as string;
     if (!id) {
        throw new AppError("Category ID is required", 400, "MISSING_PARAMETER");
     }
     await categoryService.deleteCategoryService(id);
     res.status(200).json({ success: true, message: "Category deleted successfully" });
});

export const createBulkCategoriesController = asyncHandler(async (req: Request, res: Response) => {
    const categories: Category[] = req.body.categories;
    
    if (!Array.isArray(categories)) {
       throw new AppError("Payload must contain an array of categories", 400, "INVALID_PAYLOAD");
    }

    const result = await categoryService.createBulkCategories(categories);

    return res.status(201).json({
      success: true,
      data: result
    });
});