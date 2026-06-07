"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const validateData_1 = __importDefault(require("../../middlewares/validateData"));
const category_validation_1 = require("./category.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
// Admin Routes
router.post("/create-category", (0, auth_1.default)("admin", "superadmin"), (0, validateData_1.default)(category_validation_1.createCategoryZodSchema), category_controller_1.CategoryController.createCategory);
router.get("/all-categories", category_controller_1.CategoryController.getAllCategories);
// Public Routes (For Homepage & Nav)
router.get("/nav-categories", category_controller_1.CategoryController.getNavCategories);
router.get("/featured-categories", category_controller_1.CategoryController.getFeaturedCategories);
router.put("/update-category/:id", (0, auth_1.default)("admin", "superadmin"), category_controller_1.CategoryController.updateCategory);
router.delete("/delete-category/:id", (0, auth_1.default)("admin", "superadmin"), category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
