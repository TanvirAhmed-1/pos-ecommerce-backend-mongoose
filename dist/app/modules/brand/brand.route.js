"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateData_1 = __importDefault(require("../../middlewares/validateData"));
const brand_validation_1 = require("./brand.validation");
const brand_controller_1 = require("./brand.controller");
const router = (0, express_1.Router)();
router.post("/create-brand", (0, auth_1.default)("admin", "superadmin"), (0, validateData_1.default)(brand_validation_1.BrandValidation.createBrandZodSchema), brand_controller_1.BrandController.createBrand);
router.get("/all-brands", brand_controller_1.BrandController.getAllBrands);
router.patch("/update-brand/:id", (0, auth_1.default)("admin", "superadmin"), (0, validateData_1.default)(brand_validation_1.BrandValidation.updateBrandZodSchema), brand_controller_1.BrandController.updateBrand);
router.delete("/delete-brand/:id", (0, auth_1.default)("admin", "superadmin"), brand_controller_1.BrandController.deleteBrand);
exports.BrandRoutes = router;
