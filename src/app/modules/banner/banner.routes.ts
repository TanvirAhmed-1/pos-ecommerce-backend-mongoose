import { Router } from "express";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { BannerController } from "./banner.controller";
import { BannerValidation } from "./banner.validation";

const router = Router();

// Public routes for storefront
router.get("/banners", BannerController.getActiveBanners);
router.get("/active-banners", BannerController.getActiveBanners);

// Admin protected routes
router.get("/all-banners", auth("admin", "superadmin"), BannerController.getAllBanners);
router.get("/single-banner/:id", auth("admin", "superadmin"), BannerController.getSingleBanner);

router.post(
  "/create-banner",
  auth("admin", "superadmin"),
  validateData(BannerValidation.createBannerSchema),
  BannerController.createBanner
);

router.patch(
  "/update-banner/:id",
  auth("admin", "superadmin"),
  validateData(BannerValidation.updateBannerSchema),
  BannerController.updateBanner
);

router.delete(
  "/delete-banner/:id",
  auth("admin", "superadmin"),
  BannerController.deleteBanner
);

router.patch(
  "/reorder-banners",
  auth("admin", "superadmin"),
  validateData(BannerValidation.reorderBannersSchema),
  BannerController.reorderBanners
);

export const BannerRoutes = router;
