import { Router } from "express";
import { ShippingController } from "./shipping.controller";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import {
  createDistrictSchema,
  updateDistrictSchema,
  createUpazilaSchema,
  updateUpazilaSchema,
  bulkUpdateChargesSchema,
  updateShippingSettingsSchema,
} from "./shipping.validation";

const router = Router();

// Public endpoints (Used by checkout storefront & customers)
router.get("/shipping/public-locations", ShippingController.getPublicLocations);
router.get("/shipping/districts", ShippingController.getAllDistricts);
router.get("/shipping/upazilas", ShippingController.getUpazilas);
router.get("/shipping/settings", ShippingController.getShippingSettings);
router.post("/shipping/calculate-charge", ShippingController.calculateDeliveryCharge);

// Admin & SuperAdmin management endpoints
router.post(
  "/shipping/seed",
  auth(),
  ShippingController.seedLocations
);

router.post(
  "/shipping/districts",
  auth("admin", "superadmin"),
  validateData(createDistrictSchema),
  ShippingController.createDistrict
);

router.patch(
  "/shipping/districts/:id",
  auth("admin", "superadmin"),
  validateData(updateDistrictSchema),
  ShippingController.updateDistrict
);

router.delete(
  "/shipping/districts/:id",
  auth("admin", "superadmin"),
  ShippingController.deleteDistrict
);

router.post(
  "/shipping/upazilas",
  auth("admin", "superadmin"),
  validateData(createUpazilaSchema),
  ShippingController.createUpazila
);

router.patch(
  "/shipping/upazilas/:id",
  auth("admin", "superadmin"),
  validateData(updateUpazilaSchema),
  ShippingController.updateUpazila
);

router.delete(
  "/shipping/upazilas/:id",
  auth("admin", "superadmin"),
  ShippingController.deleteUpazila
);

router.patch(
  "/shipping/bulk-charges",
  auth("admin", "superadmin"),
  validateData(bulkUpdateChargesSchema),
  ShippingController.bulkUpdateDistrictCharges
);

router.patch(
  "/shipping/settings",
  auth("admin", "superadmin"),
  validateData(updateShippingSettingsSchema),
  ShippingController.updateShippingSettings
);

export const ShippingRoutes = router;
