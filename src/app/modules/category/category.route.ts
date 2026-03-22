import { Router } from "express";
import { CategoryController } from "./category.controller";
import validateData from "../../middlewares/validateData";
import { createCategoryZodSchema } from "./category.validation";

const router = Router();

// Admin Routes
router.post(
  "/create-category",
  validateData(createCategoryZodSchema),
  CategoryController.createCategory,
);

router.get("/all-categories", CategoryController.getAllCategories);

// Public Routes (For Homepage & Nav)
router.get("/nav-categories", CategoryController.getNavCategories);
router.get("/featured-categories", CategoryController.getFeaturedCategories);

export const CategoryRoutes = router;
