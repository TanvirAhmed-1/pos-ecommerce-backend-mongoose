import express from "express";
import { AttributeController } from "./attribute.controller";
import { AttributeValidation } from "./attribute.validation";
import validateData from "../../middlewares/validateData";

const router = express.Router();

router.post(
  "/create-attributes",
  validateData(AttributeValidation.createAttributeZodSchema),
  AttributeController.createAttribute,
);

router.get("/all-attributes", AttributeController.getAllAttributes);

router.patch(
  "/delete-attribute/:id",
  validateData(AttributeValidation.updateAttributeZodSchema),
  AttributeController.updateAttribute,
);

router.delete("/delete-attribute/:id", AttributeController.deleteAttribute);

export const AttributeRoutes = router;
