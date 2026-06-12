import { Router } from "express";
import auth from "../../middlewares/auth";
import { uploadSingleImage, uploadMultipleImages } from "../../middlewares/upload";
import { UploadController } from "./upload.controller";

const router = Router();

// Single image upload (requires authenticated user, field name: 'image')
router.post(
  "/upload/single",
  auth("admin", "superadmin", "customer", "reseller"),
  uploadSingleImage("image"),
  UploadController.uploadSingle
);

// Multiple images upload (requires authenticated user, field name: 'images', max 10 files)
router.post(
  "/upload/multiple",
  auth("admin", "superadmin", "customer", "reseller"),
  uploadMultipleImages("images", 10),
  UploadController.uploadMultiple
);

export const UploadRoutes = router;
