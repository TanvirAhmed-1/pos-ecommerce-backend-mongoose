import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/category/category.route";

const routet = Router();
const allRouters = [UserRoutes, CategoryRoutes];

allRouters.forEach((router) => {
  routet.use(router);
});

export const BaseRouter = routet;
