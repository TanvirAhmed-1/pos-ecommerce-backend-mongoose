"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const cart_validation_1 = require("./cart.validation");
const validateData_1 = __importDefault(require("../../middlewares/validateData"));
const router = (0, express_1.Router)();
router.get("/get-cart", (0, auth_1.default)("user", "admin"), cart_controller_1.CartController.getMyCart);
router.post("/add-cart", (0, auth_1.default)("user"), (0, validateData_1.default)(cart_validation_1.CartValidation.addToCartSchema), cart_controller_1.CartController.addToCart);
router.patch("/update-quantity", (0, auth_1.default)("user"), cart_controller_1.CartController.updateQuantity);
router.delete("/remove-item/:variantId", (0, auth_1.default)("user"), cart_controller_1.CartController.removeItem);
router.delete("/clear-cart", (0, auth_1.default)("user"), cart_controller_1.CartController.clearCart);
exports.CartRoutes = router;
