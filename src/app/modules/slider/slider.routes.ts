import { Router } from "express";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { SliderController } from "./slider.controller";
import { SliderValidation } from "./slider.validation";

const router = Router();

router.get("/sliders", SliderController.getHomeSliders);

router.get("/all-sliders", auth("admin", "superadmin"), SliderController.getAllSliders);

router.post(
  "/create-slider",
  auth("admin", "superadmin"),
  validateData(SliderValidation.createSliderSchema),
  SliderController.createSlider,
);

router.patch(
  "/update-sliders/:id",
  auth("admin", "superadmin"),
  validateData(SliderValidation.updateSliderSchema),
  SliderController.updateSlider,
);

router.delete(
  "/delete-slider/:id",
  auth("admin", "superadmin"),
  SliderController.deleteSlider,
);

export const SliderRoutes = router;
