"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const brand_services_1 = require("./brand.services");
const createBrand = (0, catchAsync_1.default)(async (req, res) => {
    const result = await brand_services_1.BrandService.createBrandIntoDB(req.body);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Brand created successfully",
        data: result,
    });
});
const getAllBrands = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await brand_services_1.BrandService.getAllBrandsFromDB();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Brands fetched successfully",
        data: result,
    });
});
const updateBrand = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await brand_services_1.BrandService.updateBrandInDB(id, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Brand updated successfully",
        data: result,
    });
});
const deleteBrand = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await brand_services_1.BrandService.deleteBrandFromDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Brand deleted successfully",
    });
});
exports.BrandController = {
    createBrand,
    getAllBrands,
    updateBrand,
    deleteBrand,
};
