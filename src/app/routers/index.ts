import { Router } from "express";

const routet = Router();
const allRouters = [routet];

allRouters.forEach((router) => {
  routet.use(router);
});

export const BaseRouter = routet;
