"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const variant_services_1 = require("./variant.services");
const createVariant = (0, catchAsync_1.default)(async (req, res) => {
    const result = await variant_services_1.VariantService.createVariantIntoDB(req.body);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Variant created and Stock synced!",
        data: result,
    });
});
const getProductVariants = (0, catchAsync_1.default)(async (req, res) => {
    const { productId } = req.params;
    const result = await variant_services_1.VariantService.getVariantsByProductFromDB(productId);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: result,
    });
});
const updateVariant = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await variant_services_1.VariantService.updateVariantInDB(id, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Variant updated successfully",
        data: result,
    });
});
const deleteVariant = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await variant_services_1.VariantService.deleteVariantFromDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Variant deleted successfully",
        data: null,
    });
});
const getAllVariantsWithProductDetails = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await variant_services_1.VariantService.getAllVariantsWithProductDetailsFromDB();
    res.status(http_status_1.default.OK).json({
        success: true,
        data: result,
    });
});
const updateVariantStock = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
    // Admin manually update korche, tai 3rd parameter 'true'
    const result = await variant_services_1.VariantService.updateVariantStockInDB(id, stock);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Stock updated successfully!",
        data: result,
    });
});
exports.VariantController = {
    createVariant,
    getProductVariants,
    updateVariant,
    deleteVariant,
    getAllVariantsWithProductDetails,
    updateVariantStock,
};
