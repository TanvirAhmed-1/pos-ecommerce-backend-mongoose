"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const cart_services_1 = require("./cart.services");
const addToCart = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const result = await cart_services_1.CartService.addToCartIntoDB(userId, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Item added to cart successfully",
        data: result,
    });
});
const getMyCart = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const result = await cart_services_1.CartService.getMyCartFromDB(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Cart fetched successfully",
        data: result,
    });
});
const removeItem = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const { variantId } = req.params;
    const result = await cart_services_1.CartService.removeItemFromCartDB(userId, variantId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Item removed from cart successfully",
        data: result,
    });
});
const updateQuantity = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const { variantId, action } = req.body; // action: 'increment' অথবা 'decrement'
    const result = await cart_services_1.CartService.updateQuantityInCartDB(userId, variantId, action);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: `Quantity ${action}ed successfully`,
        data: result,
    });
});
// ৫. পুরো কার্ট একবারে খালি করা
const clearCart = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user._id;
    const result = await cart_services_1.CartService.clearCartFromDB(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Cart cleared successfully",
        data: result,
    });
});
exports.CartController = {
    addToCart,
    getMyCart,
    removeItem,
    updateQuantity,
    clearCart,
};
