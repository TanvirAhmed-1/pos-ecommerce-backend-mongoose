import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { CompanyServices } from "./company.services";

const getCompany = catchAsync(async (_req: Request, res: Response) => {
  const result = await CompanyServices.getCompanyDetails();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Company details fetched successfully",
    data: result || null,
  });
});

const upsertCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyServices.upsertCompanyDetails(req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Company details saved successfully",
    data: result,
  });
});

export const CompanyControllers = {
  getCompany,
  upsertCompany,
};
