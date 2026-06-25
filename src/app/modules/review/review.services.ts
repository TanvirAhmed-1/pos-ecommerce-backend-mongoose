import { Types } from "mongoose";
import { IReview } from "./review.interface";
import { ReviewModel } from "./review.model";
import { OrderModel } from "../order/order.model";

const createReviewIntoDB = async (userId: string, payload: IReview) => {
  const isExist = await ReviewModel.findOne({
    user: userId,
    product: payload.product,
  });

  if (isExist) {
    throw new Error("You have already reviewed this product.");
  }

  // Check if the user has purchased the product to set isVerified status
  const hasPurchased = await OrderModel.findOne({
    user: userId,
    "items.product": payload.product,
    orderStatus: "delivered",
  });

  const reviewData = {
    ...payload,
    user: new Types.ObjectId(userId),
    isVerified: !!hasPurchased,
  };

  const result = await ReviewModel.create(reviewData);
  return result;
};

const getProductReviewsFromDB = async (productId: string) => {
  return await ReviewModel.find({ product: productId, status: "active" })
    .populate({
      path: "user",
      select: "name email avatar",
    })
    .sort({ createdAt: -1 });
};

const getAllReviewsFromDB = async () => {
  return await ReviewModel.find()
    .populate({
      path: "user",
      select: "name email avatar",
    })
    .populate({
      path: "product",
      select: "name thumbnail slug",
    })
    .sort({ createdAt: -1 });
};

const deleteReviewFromDB = async (id: string, userId?: string, userRole?: string) => {
  const review = await ReviewModel.findById(id);
  if (!review) {
    throw new Error("Review not found");
  }

  // If user is not admin, verify they are deleting their own review
  if (userRole !== "admin" && userRole !== "superadmin" && userId) {
    if (review.user.toString() !== userId) {
      throw new Error("You are not authorized to delete this review.");
    }
  }

  const result = await ReviewModel.findByIdAndDelete(id);
  return result;
};

const updateReviewStatusInDB = async (id: string, status: "active" | "hidden") => {
  const isExist = await ReviewModel.findById(id);
  if (!isExist) {
    throw new Error("Review not found");
  }

  const result = await ReviewModel.findByIdAndUpdate(
    id,
    { status },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (result) {
    await (ReviewModel as any).calculateAverageRating(result.product);
  }

  return result;
};

export const ReviewService = {
  createReviewIntoDB,
  getProductReviewsFromDB,
  getAllReviewsFromDB,
  deleteReviewFromDB,
  updateReviewStatusInDB,
};
