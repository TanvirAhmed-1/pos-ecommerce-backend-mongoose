import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { PageServices } from "./page.services";

const createPage = catchAsync(async (req: Request, res: Response) => {
  const result = await PageServices.createPageIntoDB(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Dynamic page created successfully",
    data: result,
  });
});

const getAllPages = catchAsync(async (req: Request, res: Response) => {
  const result = await PageServices.getAllPagesFromDB(req.query);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Pages fetched successfully",
    data: result,
  });
});

const getPageBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await PageServices.getPageBySlugFromDB(slug as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Page details fetched successfully",
    data: result,
  });
});

const getPageById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PageServices.getPageByIdFromDB(id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Page fetched successfully",
    data: result,
  });
});

const updatePage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PageServices.updatePageInDB(id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Page updated successfully",
    data: result,
  });
});

const deletePage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PageServices.deletePageFromDB(id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Page deleted successfully",
    data: result,
  });
});

export const PageControllers = {
  createPage,
  getAllPages,
  getPageBySlug,
  getPageById,
  updatePage,
  deletePage,
};
