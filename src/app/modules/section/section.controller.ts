import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { SectionService } from "./section.services";

const createSection = catchAsync(async (req: Request, res: Response) => {
  const result = await SectionService.createSectionIntoDB(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Section created successfully",
    data: result,
  });
});

const getHomeSections = catchAsync(async (req: Request, res: Response) => {
  const adminMode = req.query.admin === "true";
  const result = await SectionService.getHomeSectionsFromDB(adminMode);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Sections fetched successfully",
    data: result,
  });
});

const updateSection = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SectionService.updateSectionInDB(id as string, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Section updated successfully",
    data: result,
  });
});

const deleteSection = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await SectionService.deleteSectionFromDB(id as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Section deleted successfully",
    data: null,
  });
});

export const SectionController = {
  createSection,
  getHomeSections,
  updateSection,
  deleteSection,
};
