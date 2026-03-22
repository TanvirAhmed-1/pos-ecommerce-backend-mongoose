import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { VariantService } from "./variant.services";

const createVariant = catchAsync(async (req: Request, res: Response) => {
  const result = await VariantService.createVariantIntoDB(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Variant created successfully",
    data: result,
  });
});

const getProductVariants = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await VariantService.getVariantsByProductFromDB(
    productId as string,
  );
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const deleteVariant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await VariantService.deleteVariantFromDB(id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Variant deleted successfully",
    data: null,
  });
});

const updateVariant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // ভেরিয়েন্ট আইডি
  const { stock } = req.body; // নতুন স্টকের সংখ্যা

  const result = await VariantService.updateVariantInDB(id as string, stock);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Variant updated successfully",
    data: result,
  });
});

export const VariantController = {
  createVariant,
  getProductVariants,
  deleteVariant,
  updateVariant,
};
