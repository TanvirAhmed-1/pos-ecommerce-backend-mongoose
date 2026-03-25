import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { ProductRoutes } from "../modules/product/product.route";

const routet = Router();
const allRouters = [UserRoutes, CategoryRoutes, BrandRoutes, ProductRoutes];

allRouters.forEach((router) => {
  routet.use(router);
});

export const BaseRouter = routet;
