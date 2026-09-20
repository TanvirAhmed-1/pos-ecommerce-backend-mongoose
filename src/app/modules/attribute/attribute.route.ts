import express from "express";
import { AttributeController } from "./attribute.controller";
import { AttributeValidation } from "./attribute.validation";
import validateData from "../../middlewares/validateData";

const router = express.Router();

router.post(
  "/create-attribute",
  validateData(AttributeValidation.createAttributeZodSchema),
  AttributeController.createAttribute,
);

// Also keep /create-attributes alias for backwards compatibility
router.post(
  "/create-attributes",
  validateData(AttributeValidation.createAttributeZodSchema),
  AttributeController.createAttribute,
);

router.get("/all-attributes", AttributeController.getAllAttributes);

router.patch(
  "/update-attribute/:id",
  validateData(AttributeValidation.updateAttributeZodSchema),
  AttributeController.updateAttribute,
);

router.put(
  "/update-attribute/:id",
  validateData(AttributeValidation.updateAttributeZodSchema),
  AttributeController.updateAttribute,
);

router.delete("/delete-attribute/:id", AttributeController.deleteAttribute);

export const AttributeRoutes = router;

