import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { BannerService } from "./banner.services";

const createBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await BannerService.createBannerIntoDB(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Promotional Banner created successfully",
    data: result,
  });
});

const getActiveBanners = catchAsync(async (_req: Request, res: Response) => {
  const result = await BannerService.getActiveBannersFromDB();
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const getAllBanners = catchAsync(async (_req: Request, res: Response) => {
  const result = await BannerService.getAllBannersForAdminFromDB();
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const getSingleBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BannerService.getSingleBannerFromDB(id as string);
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BannerService.updateBannerInDB(id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Promotional Banner updated successfully",
    data: result,
  });
});

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await BannerService.deleteBannerFromDB(id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Promotional Banner deleted successfully",
    data: null,
  });
});

const reorderBanners = catchAsync(async (req: Request, res: Response) => {
  const { orders } = req.body;
  const result = await BannerService.reorderBannersInDB(orders);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Promotional Banners reordered successfully",
    data: result,
  });
});

export const BannerController = {
  createBanner,
  getActiveBanners,
  getAllBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
};
