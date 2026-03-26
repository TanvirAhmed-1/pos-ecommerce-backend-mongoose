import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { WishlistService } from "./wishlist.services";

const addProductToWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
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
  const userId = req.user.id;
  const result = await WishlistService.getMyWishlistFromDB(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Wishlist fetched successfully",
    data: result,
  });
});

const removeProductFromWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { productId } = req.body;
    await WishlistService.removeProductFromWishlistDB(userId, productId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Product deleted from wishlist successfully",
    });
  },
);

export const WishlistController = {
  addProductToWishlist,
  getMyWishlist,
  removeProductFromWishlist,
};
