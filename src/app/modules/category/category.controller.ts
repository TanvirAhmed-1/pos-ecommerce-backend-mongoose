import { Request, Response } from "express";
import { status } from "http-status";
import catchAsync from "../../utils/catchAsync";
import { CategoryService } from "./category.services";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategoryIntoDB(req.body);
  res.status(status.CREATED).json({
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getNavCategories = catchAsync(async (_req: Request, res: Response) => {
  const result = await CategoryService.getNavCategories();
  res.status(status.OK).json({
    success: true,
    message: "Navigation categories fetched successfully",
    data: result,
  });
});

const getFeaturedCategories = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await CategoryService.getFeaturedCategories();
    res.status(status.OK).json({
      success: true,
      message: "Featured categories fetched successfully",
      data: result,
    });
  },
);

const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories();
  res.status(status.OK).json({
    success: true,
    message: "All categories fetched successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CategoryService.deleteCategoryFromDB(id as string);
  res.status(status.OK).json({
    success: true,
    message: "Category deleted successfully",
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.updateCategoryInDB(id as string, req.body);
  res.status(status.OK).json({
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getNavCategories,
  getFeaturedCategories,
  getAllCategories,
  deleteCategory,
  updateCategory,
};
