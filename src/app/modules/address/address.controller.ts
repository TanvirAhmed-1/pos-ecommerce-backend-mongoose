import { Request, Response } from "express";
import { status } from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AddressServices } from "./address.services";

const createAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await AddressServices.createAddress(userId, req.body);
  res.status(status.CREATED).json({
    success: true,
    message: "Address created successfully",
    data: result,
  });
});

const getMyAddresses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await AddressServices.getMyAddresses(userId);
  res.status(status.OK).json({
    success: true,
    message: "Addresses fetched successfully",
    data: result,
  });
});

const deleteAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await AddressServices.deleteAddress(userId, req.params.id as string);
  res.status(status.OK).json({
    success: true,
    message: "Address deleted successfully",
    data: result,
  });
});

export const AddressController = {
  createAddress,
  getMyAddresses,
  deleteAddress,
};
