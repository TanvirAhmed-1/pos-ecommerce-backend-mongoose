import { Router } from "express";
import { VariantController } from "./variant.controller";
import validateData from "../../middlewares/validateData";
import { createVariantSchema } from "./variant.validation";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
  "/create-variant",
  auth("admin"),
  validateData(createVariantSchema),
  VariantController.createVariant,
);

router.get("/product/:productId", VariantController.getProductVariants);

// আপডেট রাউটটি আপনার কোডে মিসিং ছিল
router.patch(
  "/update-variant/:id",
  auth("admin"),
  VariantController.updateVariant,
);

router.delete(
  "/delete-variant/:id",
  auth("admin"),
  VariantController.deleteVariant,
);

export const VariantRoutes = router;
