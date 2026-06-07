"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const product_services_1 = require("./product.services");
const createProduct = (0, catchAsync_1.default)(async (req, res) => {
    const result = await product_services_1.ProductService.createProductIntoDB(req.body);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Product created successfully",
        data: result,
    });
});
const getAllProducts = (0, catchAsync_1.default)(async (req, res) => {
    const result = await product_services_1.ProductService.getAllProductsFromDB(req.query);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Products fetched successfully",
        data: result,
    });
});
const getSingleProduct = (0, catchAsync_1.default)(async (req, res) => {
    const { slug } = req.params;
    const result = await product_services_1.ProductService.getSingleProductBySlugFromDB(slug);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Product detail fetched successfully",
        data: result,
    });
});
const updateProduct = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await product_services_1.ProductService.updateProductInDB(id, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Product updated successfully",
        data: result,
    });
});
const deleteProduct = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await product_services_1.ProductService.deleteProductFromDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Product deleted successfully",
        data: null,
    });
});
exports.ProductController = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};
