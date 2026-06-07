"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateData_1 = __importDefault(require("../../middlewares/validateData"));
const slider_controller_1 = require("./slider.controller");
const slider_validation_1 = require("./slider.validation");
const router = (0, express_1.Router)();
router.get("/sliders", slider_controller_1.SliderController.getHomeSliders);
router.get("/all-sliders", (0, auth_1.default)("admin"), slider_controller_1.SliderController.getAllSliders);
router.post("/create-slider", (0, auth_1.default)("admin"), (0, validateData_1.default)(slider_validation_1.SliderValidation.createSliderSchema), slider_controller_1.SliderController.createSlider);
router.patch("/update-sliders/:id", (0, auth_1.default)("admin"), (0, validateData_1.default)(slider_validation_1.SliderValidation.updateSliderSchema), slider_controller_1.SliderController.updateSlider);
router.delete("/delete-slider/:id", (0, auth_1.default)("admin"), slider_controller_1.SliderController.deleteSlider);
exports.SliderRoutes = router;
