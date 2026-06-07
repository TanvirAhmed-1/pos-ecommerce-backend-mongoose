import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { VariantService } from "./variant.services";

const createVariant = catchAsync(async (req: Request, res: Response) => {
  const result = await VariantService.createVariantIntoDB(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Variant created and Stock synced!",
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

const updateVariant = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VariantService.updateVariantInDB(id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Variant updated successfully",
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
const getAllVariantsWithProductDetails = catchAsync(
  async (_req: Request, res: Response) => {
    const result =
      await VariantService.getAllVariantsWithProductDetailsFromDB();
    res.status(httpStatus.OK).json({
      success: true,
      data: result,
    });
  },
);



const updateVariantStock = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stock } = req.body;

  // Admin manually update korche, tai 3rd parameter 'true'
  const result = await VariantService.updateVariantStockInDB(id as string, stock);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Stock updated successfully!",
    data: result,
  });
});

export const VariantController = {
  createVariant,
  getProductVariants,
  updateVariant,
  deleteVariant,
  getAllVariantsWithProductDetails,
  updateVariantStock,
};
