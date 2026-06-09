import { Router } from "express";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { PageControllers } from "./page.controller";
import { PageValidation } from "./page.validation";

const router = Router();

// Public routes
router.get("/pages", PageControllers.getAllPages);
router.get("/pages/:slug", PageControllers.getPageBySlug);

// Protected routes (Admin / Superadmin only)
router.post(
  "/pages",
  auth("admin", "superadmin"),
  validateData(PageValidation.createPageZodSchema),
  PageControllers.createPage
);

router.get(
  "/pages/id/:id",
  auth("admin", "superadmin"),
  PageControllers.getPageById
);

router.patch(
  "/pages/:id",
  auth("admin", "superadmin"),
  validateData(PageValidation.updatePageZodSchema),
  PageControllers.updatePage
);

router.delete(
  "/pages/:id",
  auth("admin", "superadmin"),
  PageControllers.deletePage
);

export const PageRoutes = router;
