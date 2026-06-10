import { Router } from "express";
import { WishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { WishlistValidation } from "./wishlist.validation";

const router = Router();

router.get("/my-wishlist", auth("customer", "reseller"), WishlistController.getMyWishlist);

router.post(
  "/add-wishlist",
  auth("customer", "reseller"),
  validateData(WishlistValidation.toggleWishlistSchema),
  WishlistController.addProductToWishlist,
);

router.delete(
  "/remove-wishlist/:productId",
  auth("customer", "reseller"),
  WishlistController.removeProductFromWishlist,
);

export const WishlistRoutes = router;
