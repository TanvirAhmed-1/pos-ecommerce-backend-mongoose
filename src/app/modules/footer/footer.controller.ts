import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { FooterServices } from "./footer.services";

const getFooter = catchAsync(async (_req: Request, res: Response) => {
  const result = await FooterServices.getFooterData();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Footer data fetched successfully",
    data: result,
  });
});

export const FooterControllers = {
  getFooter,
};
