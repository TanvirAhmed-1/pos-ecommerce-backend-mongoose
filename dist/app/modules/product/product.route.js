"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateData_1 = __importDefault(require("../../middlewares/validateData"));
const router = (0, express_1.Router)();
// Public Routes
router.get("/product", product_controller_1.ProductController.getAllProducts);
router.get("/product/:slug", product_controller_1.ProductController.getSingleProduct);
// Admin Only Routes
router.post("/create-product", (0, auth_1.default)("admin", "superadmin"), (0, validateData_1.default)(product_validation_1.ProductValidation.createProductSchema), product_controller_1.ProductController.createProduct);
router.patch("/product-update/:id", (0, auth_1.default)("admin", "superadmin"), (0, validateData_1.default)(product_validation_1.ProductValidation.updateProductSchema), product_controller_1.ProductController.updateProduct);
router.delete("/delete-product/:id", (0, auth_1.default)("admin", "superadmin"), product_controller_1.ProductController.deleteProduct);
exports.ProductRoutes = router;
