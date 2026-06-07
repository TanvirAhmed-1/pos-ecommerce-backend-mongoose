import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { BrandService } from "./brand.services";

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.createBrandIntoDB(req.body);
  res.status(status.CREATED).json({
    success: true,
    message: "Brand created successfully",
    data: result,
  });
});

const getAllBrands = catchAsync(async (_req: Request, res: Response) => {
  const result = await BrandService.getAllBrandsFromDB();
  res.status(status.OK).json({
    success: true,
    message: "Brands fetched successfully",
    data: result,
  });
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BrandService.updateBrandInDB(id as string, req.body);
  res.status(status.OK).json({
    success: true,
    message: "Brand updated successfully",
    data: result,
  });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await BrandService.deleteBrandFromDB(id as string);
  res.status(status.OK).json({
    success: true,
    message: "Brand deleted successfully",
  });
});

export const BrandController = {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
};
