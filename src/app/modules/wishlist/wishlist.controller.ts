import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { WishlistService } from "./wishlist.services";

const addProductToWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const { productId } = req.body;
  const result = await WishlistService.addProductToWishlistDB(
    userId,
    productId,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Product added to wishlist successfully",
    data: result,
  });
});

const getMyWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any)._id;
  const result = await WishlistService.getMyWishlistFromDB(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Wishlist fetched successfully",
    data: result,
  });
});

const removeProductFromWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)._id;
    const { productId } = req.body;
    const result = await WishlistService.removeProductFromWishlistDB(
      userId,
      productId,
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Product removed from wishlist successfully",
      data: result,
    });
  },
);

export const WishlistController = {
  addProductToWishlist,
  getMyWishlist,
  removeProductFromWishlist,
};
