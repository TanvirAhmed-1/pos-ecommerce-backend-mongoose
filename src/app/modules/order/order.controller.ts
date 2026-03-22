import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { OrderService } from "./order.services";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const result = await OrderService.createOrderIntoDB(userId, req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "successfully created order",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const result = await OrderService.getMyOrdersFromDB(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const { id } = req.params;
  const result = await OrderService.getSingleOrderFromDB(id as string, userId);

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getSingleOrder,
};
