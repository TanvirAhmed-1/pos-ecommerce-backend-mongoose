"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const attribute_model_1 = require("../attribute/attribute.model");
const product_model_1 = require("../product/product.model");
const variant_model_1 = require("./variant.model");
const createVariantIntoDB = async (payload) => {
    for (const attr of payload.attributes) {
        const attributeExists = await attribute_model_1.AttributeModel.findById(attr.attribute);
        if (!attributeExists) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Attribute with ID ${attr.attribute} not found!`);
        }
        if (!attributeExists.values.includes(attr.value)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Value "${attr.value}" is not valid for ${attributeExists.name}`);
        }
    }
    // ২. সব ঠিক থাকলে ক্রিয়েট হবে
    const result = await variant_model_1.VariantModel.create(payload);
    if (result) {
        await updateProductTotalStock(result.product.toString());
    }
    return result;
};
const getAllVariantsWithProductDetailsFromDB = async () => {
    const result = await variant_model_1.VariantModel.find({ isActive: true })
        .populate({
        path: "product",
        select: "name slug image description",
    })
        .populate({
        path: "attributes.attribute",
        select: "name",
    });
    return result;
};
const updateProductTotalStock = async (productId) => {
    const totalStockData = await variant_model_1.VariantModel.aggregate([
        {
            $match: {
                product: new mongoose_1.default.Types.ObjectId(productId),
                isActive: true,
            },
        },
        { $group: { _id: "$product", total: { $sum: "$stock" } } },
    ]);
    const totalStock = totalStockData.length > 0 ? totalStockData[0].total : 0;
    await product_model_1.ProductModel.findByIdAndUpdate(productId, { totalStock });
};
const getVariantsByProductFromDB = async (productId) => {
    return await variant_model_1.VariantModel.find({ product: productId, isActive: true })
        .populate("attributes.attribute") // অ্যাট্রিবিউট ডিটেইলস (নাম) দেখাবে
        .populate("product", "name SKU");
};
const updateVariantInDB = async (id, payload) => {
    const result = await variant_model_1.VariantModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (result && payload.stock !== undefined) {
        await updateProductTotalStock(result.product.toString());
    }
    return result;
};
const deleteVariantFromDB = async (id) => {
    const variant = await variant_model_1.VariantModel.findById(id);
    if (!variant)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Variant not found");
    const productId = variant.product.toString();
    await variant_model_1.VariantModel.findByIdAndDelete(id);
    await updateProductTotalStock(productId);
    return null;
};
const updateVariantStockInDB = async (variantId, addedStock) => {
    const result = await variant_model_1.VariantModel.findByIdAndUpdate(variantId, { $inc: { stock: addedStock } }, { new: true, runValidators: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Variant id not found!");
    }
    await updateProductTotalStock(result.product.toString());
    return result;
};
exports.VariantService = {
    createVariantIntoDB,
    getVariantsByProductFromDB,
    updateVariantInDB,
    deleteVariantFromDB,
    getAllVariantsWithProductDetailsFromDB,
    updateVariantStockInDB,
};
