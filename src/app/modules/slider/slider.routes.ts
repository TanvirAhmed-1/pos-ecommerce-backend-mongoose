import { Router } from "express";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { SliderController } from "./slider.controller";
import { SliderValidation } from "./slider.validation";

const router = Router();

router.get("/sliders", SliderController.getHomeSliders);

router.get("/all-sliders", auth("admin"), SliderController.getAllSliders);

router.post(
  "/create-slider",
  auth("admin"),
  validateData(SliderValidation.createSliderSchema),
  SliderController.createSlider,
);

router.patch(
  "/update-sliders/:id",
  auth("admin"),
  validateData(SliderValidation.updateSliderSchema),
  SliderController.updateSlider,
);

router.delete(
  "/delete-slider/:id",
  auth("admin"),
  SliderController.deleteSlider,
);

export const SliderRoutes = router;
