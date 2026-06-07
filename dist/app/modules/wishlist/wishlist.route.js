"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRoutes = void 0;
const express_1 = require("express");
const wishlist_controller_1 = require("./wishlist.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateData_1 = __importDefault(require("../../middlewares/validateData"));
const wishlist_validation_1 = require("./wishlist.validation");
const router = (0, express_1.Router)();
router.get("/my-wishlist", (0, auth_1.default)("user"), wishlist_controller_1.WishlistController.getMyWishlist);
router.post("/add-wishlist", (0, auth_1.default)("user"), (0, validateData_1.default)(wishlist_validation_1.WishlistValidation.toggleWishlistSchema), wishlist_controller_1.WishlistController.addProductToWishlist);
router.delete("/remove-wishlist/:productId", (0, auth_1.default)("user"), wishlist_controller_1.WishlistController.removeProductFromWishlist);
exports.WishlistRoutes = router;
