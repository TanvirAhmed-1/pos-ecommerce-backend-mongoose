import express from "express";
import { VariantController } from "./variant.controller";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { createVariantSchema, updateVariantSchema } from "./variant.validation";

const router = express.Router();
router.use(auth());

router.post(
  "/create-variant",
  validateData(createVariantSchema),
  VariantController.createVariant,
);
router.get("/all-variants", VariantController.getAllVariantsWithProductDetails);
router.get("/product/:productId", VariantController.getProductVariants);
router.patch(
  "/update-variant/:id",
  validateData(updateVariantSchema),
  VariantController.updateVariant,
);
router.patch("/update-variant-stock/:id", VariantController.updateVariantStock);
router.delete("/delete-variant/:id", VariantController.deleteVariant);
export const VariantRoutes = router;
