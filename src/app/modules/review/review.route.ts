import { Router } from "express";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { ReviewValidation } from "./review.validation";
import { ReviewController } from "./review.controller";

const router = Router();

router.post(
  "/create-review",
  auth("customer", "reseller"),
  validateData(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview,
);

router.get("/product-reviews/:productId", ReviewController.getProductReviews);

router.get(
  "/all-reviews",
  auth("admin", "superadmin"),
  ReviewController.getAllReviews,
);

router.delete(
  "/delete-review/:id",
  auth("admin", "superadmin", "customer", "reseller"),
  ReviewController.deleteReview,
);

router.patch(
  "/reviews/:id/status",
  auth("admin", "superadmin"),
  validateData(ReviewValidation.updateReviewStatusZodSchema),
  ReviewController.updateReviewStatus,
);

export const ReviewRoutes = router;
