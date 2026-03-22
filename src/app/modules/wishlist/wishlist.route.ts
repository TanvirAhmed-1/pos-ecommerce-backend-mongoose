import { Router } from "express";
import { WishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { WishlistValidation } from "./wishlist.validation";

const router = Router();

router.get("/my-wishlist", auth("user"), WishlistController.getMyWishlist);

router.post(
  "/add-wishlist",
  auth("user"),
  validateData(WishlistValidation.toggleWishlistSchema),
  WishlistController.addProductToWishlist,
);

router.delete(
  "/remove-wishlist/:productId",
  auth("user"),
  WishlistController.removeProductFromWishlist,
);

export const WishlistRoutes = router;
