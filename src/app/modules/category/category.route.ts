import { Router } from "express";
import { CategoryController } from "./category.controller";
import validateData from "../../middlewares/validateData";
import { createCategoryZodSchema } from "./category.validation";
import auth from "../../middlewares/auth";

const router = Router();
// Admin Routes
router.post(
  "/create-category",
  auth("admin", "superadmin"),
  validateData(createCategoryZodSchema),
  CategoryController.createCategory,
);

router.get("/all-categories", CategoryController.getAllCategories);

// Public Routes (For Homepage & Nav)
router.get("/nav-categories", CategoryController.getNavCategories);
router.get("/featured-categories", CategoryController.getFeaturedCategories);

router.put(
  "/update-category/:id",
  auth("admin", "superadmin"),
  CategoryController.updateCategory,
);

router.delete(
  "/delete-category/:id",
  auth("admin", "superadmin"),
  CategoryController.deleteCategory,
);
export const CategoryRoutes = router;
