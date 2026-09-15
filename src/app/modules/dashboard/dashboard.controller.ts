import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { DashboardServices } from "./dashboard.services";

const getOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.getOverviewDataFromDB(req.query);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Overview statistics retrieved successfully!",
    data: result
  });
});

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.getAnalyticsDataFromDB(req.query);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Analytics statistics retrieved successfully!",
    data: result
  });
});

export const DashboardController = {
  getOverview,
  getAnalytics
};
