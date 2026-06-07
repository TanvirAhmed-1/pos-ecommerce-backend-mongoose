import express from "express";
import { VariantController } from "./variant.controller";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { createVariantSchema, updateVariantSchema } from "./variant.validation";

const router = express.Router();
router.post(
  "/create-variant",
  auth("admin", "superadmin"),
  validateData(createVariantSchema),
  VariantController.createVariant,
);
router.get("/all-variants", VariantController.getAllVariantsWithProductDetails);
router.get("/product/:productId", VariantController.getProductVariants);
router.patch(
  "/update-variant/:id",
  auth("admin", "superadmin"),
  validateData(updateVariantSchema),
  VariantController.updateVariant,
);
router.patch(
  "/update-variant-stock/:id",
  auth("admin", "superadmin"),
  VariantController.updateVariantStock,
);
router.delete(
  "/delete-variant/:id",
  auth("admin", "superadmin"),
  VariantController.deleteVariant,
);
export const VariantRoutes = router;
