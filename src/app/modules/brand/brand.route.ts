import { Router } from "express";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { BrandValidation } from "./brand.validation";
import { BrandController } from "./brand.controller";

const router = Router();
router.use(auth());
router.post(
  "/create-brand",
  validateData(BrandValidation.createBrandZodSchema),
  BrandController.createBrand,
);

router.get("/all-brands", BrandController.getAllBrands);

router.patch(
  "/update-brand/:id",
  validateData(BrandValidation.updateBrandZodSchema),
  BrandController.updateBrand,
);

router.delete("/delete-brand/:id", BrandController.deleteBrand);

export const BrandRoutes = router;
