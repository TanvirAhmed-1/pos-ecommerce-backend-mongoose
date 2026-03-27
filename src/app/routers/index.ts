import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { ProductRoutes } from "../modules/product/product.route";
import { VariantRoutes } from "../modules/variant/variant.routes";
import { AttributeRoutes } from "../modules/attribute/attribute.route";
import { CartRoutes } from "../modules/cart/cart.routes";
import { WishlistRoutes } from "../modules/wishlist/wishlist.route";
import { OrderRoutes } from "../modules/order/order.routes";
import { PaymentRoutes } from "../modules/payment/payment.route";

const routet = Router();
const allRouters = [
  UserRoutes,
  CategoryRoutes,
  BrandRoutes,
  ProductRoutes,
  VariantRoutes,
  AttributeRoutes,
  CartRoutes,
  WishlistRoutes,
  OrderRoutes,
  PaymentRoutes,
];

allRouters.forEach((router) => {
  routet.use(router);
});

export const BaseRouter = routet;
