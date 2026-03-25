import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AttributeService } from "./attribute.services";

const createAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await AttributeService.createAttributeIntoDB(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Attribute created successfully",
    data: result,
  });
});

const getAllAttributes = catchAsync(async (req: Request, res: Response) => {
  const result = await AttributeService.getAllAttributesFromDB();
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const updateAttribute = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AttributeService.updateAttributeInDB(
    id as string,
    req.body,
  );
  res.status(httpStatus.OK).json({
    success: true,
    message: "Attribute updated successfully",
    data: result,
  });
});

const deleteAttribute = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await AttributeService.deleteAttributeFromDB(id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Attribute delete successfully",
  });
});

export const AttributeController = {
  createAttribute,
  getAllAttributes,
  updateAttribute,
  deleteAttribute,
};
