import { Router } from "express";
import { CategoryController } from "./category.controller";
import validateData from "../../middlewares/validateData";
import { createCategoryZodSchema } from "./category.validation";
import auth from "../../middlewares/auth";

const router = Router();
router.use(auth());
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
router.put("/g/:id", CategoryController.updateCategory);
router.delete("/delete-category/:id", CategoryController.deleteCategory);
export const CategoryRoutes = router;
