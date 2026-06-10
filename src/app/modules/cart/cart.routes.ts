import { Router } from "express";
import { CartController } from "./cart.controller";
import auth from "../../middlewares/auth";
import { CartValidation } from "./cart.validation";
import validateData from "../../middlewares/validateData";

const router = Router();
router.get("/get-cart", auth("customer", "reseller", "admin"), CartController.getMyCart);

router.post(
  "/add-cart",
  auth("customer", "reseller"),
  validateData(CartValidation.addToCartSchema),
  CartController.addToCart,
);

router.patch("/update-quantity", auth("customer", "reseller"), CartController.updateQuantity);

router.delete(
  "/remove-item/:variantId",
  auth("customer", "reseller"),
  CartController.removeItem,
);

router.delete("/clear-cart", auth("customer", "reseller"), CartController.clearCart);

export const CartRoutes = router;
