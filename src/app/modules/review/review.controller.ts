import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { ReviewService } from "./review.services";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await ReviewService.createReviewIntoDB(userId, req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Review submitted successfully",
    data: result,
  });
});

const getProductReviews = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ReviewService.getProductReviewsFromDB(productId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Product reviews fetched successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviewsFromDB();

  res.status(httpStatus.OK).json({
    success: true,
    message: "All reviews fetched successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  await ReviewService.deleteReviewFromDB(id, userId, userRole);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Review deleted successfully",
  });
});

const updateReviewStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await ReviewService.updateReviewStatusInDB(id, status);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Review status updated successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
  updateReviewStatus,
};
