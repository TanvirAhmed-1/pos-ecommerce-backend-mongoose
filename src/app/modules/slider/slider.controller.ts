import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { SliderService } from "./slider.services";

const createSlider = catchAsync(async (req: Request, res: Response) => {
  const result = await SliderService.createSliderIntoDB(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Slider created successfully",
    data: result,
  });
});

const getHomeSliders = catchAsync(async (req: Request, res: Response) => {
  const result = await SliderService.getActiveSlidersFromDB();
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const getAllSliders = catchAsync(async (req: Request, res: Response) => {
  const result = await SliderService.getAllSlidersForAdminFromDB();
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const updateSlider = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SliderService.updateSliderInDB(id as string, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Slider updated successfully",
    data: result,
  });
});

const deleteSlider = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await SliderService.deleteSliderFromDB(id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Slider deleted successfully",
    data: null,
  });
});

export const SliderController = {
  createSlider,
  getHomeSliders,
  getAllSliders,
  updateSlider,
  deleteSlider,
};
