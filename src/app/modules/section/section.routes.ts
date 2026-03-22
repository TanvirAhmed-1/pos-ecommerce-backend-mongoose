import { Router } from "express";
import { SectionController } from "./section.controller";
import validateData from "../../middlewares/validateData";
import { createSectionSchema } from "./section.validation";
import auth from "../../middlewares/auth";

const router = Router();

// এডমিন নতুন সেকশন বানাবে
router.post(
  "/create-section",
  auth("admin", "superadmin"),
  validateData(createSectionSchema),
  SectionController.createSection,
);

// পাবলিকলি হোমপেজের জন্য ডাটা কল হবে
router.get("/get-home-sections", SectionController.getHomeSections);

// এডমিন সেকশন আপডেট করবে
router.patch(
  "/update-section/:id",
  auth("admin", "superadmin"),
  SectionController.updateSection,
);

// এডমিন সেকশন ডিলিট করবে
router.delete(
  "/delete-section/:id",
  auth("admin", "superadmin"),
  SectionController.deleteSection,
);

export const SectionRoutes = router;
