import { Router } from "express";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { BrandValidation } from "./brand.validation";
import { BrandController } from "./brand.controller";
import { uploadAndAttachSingle } from "../../middlewares/upload";

const router = Router();
router.post(
  "/create-brand",
  auth("admin", "superadmin"),
  uploadAndAttachSingle("logo", "logo", "brands"),
  validateData(BrandValidation.createBrandZodSchema),
  BrandController.createBrand,
);

router.get("/all-brands", BrandController.getAllBrands);

router.patch(
  "/update-brand/:id",
  auth("admin", "superadmin"),
  uploadAndAttachSingle("logo", "logo", "brands"),
  validateData(BrandValidation.updateBrandZodSchema),
  BrandController.updateBrand,
);

router.delete(
  "/delete-brand/:id",
  auth("admin", "superadmin"),
  BrandController.deleteBrand,
);

export const BrandRoutes = router;
