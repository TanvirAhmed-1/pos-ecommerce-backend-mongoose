import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { CartService } from "./cart.services";

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const result = await CartService.addToCartIntoDB(userId, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Item added to cart successfully",
    data: result,
  });
});

const getMyCart = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const result = await CartService.getMyCartFromDB(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Cart fetched successfully",
    data: result,
  });
});

const removeItem = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const { variantId } = req.params;
  const result = await CartService.removeItemFromCartDB(
    userId,
    variantId as string,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Item removed from cart successfully",
    data: result,
  });
});

const updateQuantity = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const { variantId, action } = req.body; // action: 'increment' অথবা 'decrement'
  const result = await CartService.updateQuantityInCartDB(
    userId,
    variantId,
    action,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: `Quantity ${action}ed successfully`,
    data: result,
  });
});

// ৫. পুরো কার্ট একবারে খালি করা
const clearCart = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const result = await CartService.clearCartFromDB(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Cart cleared successfully",
    data: result,
  });
});

export const CartController = {
  addToCart,
  getMyCart,
  removeItem,
  updateQuantity,
  clearCart,
};
