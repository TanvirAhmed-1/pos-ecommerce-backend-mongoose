import { Router } from "express";
import { CartController } from "./cart.controller";
import auth from "../../middlewares/auth";
import { CartValidation } from "./cart.validation";
import validateData from "../../middlewares/validateData";

const router = Router();
router.get("/get-cart", auth("user", "admin"), CartController.getMyCart);

router.post(
  "/add-cart",
  auth("user"),
  validateData(CartValidation.addToCartSchema),
  CartController.addToCart,
);

router.patch("/update-quantity", auth("user"), CartController.updateQuantity);

router.delete(
  "/remove-item/:variantId",
  auth("user"),
  CartController.removeItem,
);

router.delete("/clear-cart", auth("user"), CartController.clearCart);

export const CartRoutes = router;
