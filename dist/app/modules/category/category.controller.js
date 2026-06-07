"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_1 = require("http-status");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const category_services_1 = require("./category.services");
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_services_1.CategoryService.createCategoryIntoDB(req.body);
    res.status(http_status_1.status.CREATED).json({
        success: true,
        message: "Category created successfully",
        data: result,
    });
});
const getNavCategories = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await category_services_1.CategoryService.getNavCategories();
    res.status(http_status_1.status.OK).json({
        success: true,
        message: "Navigation categories fetched successfully",
        data: result,
    });
});
const getFeaturedCategories = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await category_services_1.CategoryService.getFeaturedCategories();
    res.status(http_status_1.status.OK).json({
        success: true,
        message: "Featured categories fetched successfully",
        data: result,
    });
});
const getAllCategories = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await category_services_1.CategoryService.getAllCategories();
    res.status(http_status_1.status.OK).json({
        success: true,
        message: "All categories fetched successfully",
        data: result,
    });
});
const deleteCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await category_services_1.CategoryService.deleteCategoryFromDB(id);
    res.status(http_status_1.status.OK).json({
        success: true,
        message: "Category deleted successfully",
    });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await category_services_1.CategoryService.updateCategoryInDB(id, req.body);
    res.status(http_status_1.status.OK).json({
        success: true,
        message: "Category updated successfully",
        data: result,
    });
});
exports.CategoryController = {
    createCategory,
    getNavCategories,
    getFeaturedCategories,
    getAllCategories,
    deleteCategory,
    updateCategory,
};
