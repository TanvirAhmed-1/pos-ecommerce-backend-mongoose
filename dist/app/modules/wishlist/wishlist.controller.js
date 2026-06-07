"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const wishlist_services_1 = require("./wishlist.services");
const addProductToWishlist = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;
    const result = await wishlist_services_1.WishlistService.addProductToWishlistDB(userId, productId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Product added to wishlist successfully",
        data: result,
    });
});
const getMyWishlist = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const result = await wishlist_services_1.WishlistService.getMyWishlistFromDB(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Wishlist fetched successfully",
        data: result,
    });
});
const removeProductFromWishlist = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;
    await wishlist_services_1.WishlistService.removeProductFromWishlistDB(userId, productId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Product deleted from wishlist successfully",
    });
});
exports.WishlistController = {
    addProductToWishlist,
    getMyWishlist,
    removeProductFromWishlist,
};
