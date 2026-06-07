"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = require("./product.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createProductIntoDB = async (payload) => {
    const result = await product_model_1.ProductModel.create(payload);
    return result;
};
const getAllProductsFromDB = async (query) => {
    const { searchTerm, category, subcategory, brand, minPrice, maxPrice, sort, page = 1, limit = 20, } = query;
    let filter = { isActive: true };
    if (searchTerm) {
        filter.$or = [
            { name: { $regex: searchTerm, $options: "i" } },
            { slug: { $regex: searchTerm, $options: "i" } },
            { keywords: { $in: [new RegExp(searchTerm, "i")] } },
        ];
    }
    // ২. ফিল্টারিং লজিক
    if (category)
        filter.category = category;
    if (subcategory)
        filter.subcategory = subcategory;
    if (brand)
        filter.brand = brand;
    // ৩. প্রাইজ রেঞ্জ ফিল্টার
    if (minPrice || maxPrice) {
        filter.salePrice = {};
        if (minPrice)
            filter.salePrice.$gte = Number(minPrice);
        if (maxPrice)
            filter.salePrice.$lte = Number(maxPrice);
    }
    // ৪. পেজিনেশন লজিক (Skip and Limit)
    const skip = (Number(page) - 1) * Number(limit);
    const productQuery = product_model_1.ProductModel.find(filter)
        .populate("category", "name slug")
        .populate("brand", "name logo")
        .populate("productVariants")
        .skip(skip)
        .limit(Number(limit));
    // ৫. সর্টিং (Default: Newest first)
    if (sort) {
        productQuery.sort(sort);
    }
    else {
        productQuery.sort("-createdAt");
    }
    const result = await productQuery;
    const total = await product_model_1.ProductModel.countDocuments(filter);
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPage: Math.ceil(total / Number(limit)),
        },
        data: result,
    };
};
const getSingleProductBySlugFromDB = async (slug) => {
    const result = await product_model_1.ProductModel.findOne({ slug, isActive: true })
        .populate("category")
        .populate("brand")
        .populate("productVariants");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found!");
    }
    return result;
};
const updateProductInDB = async (id, payload) => {
    const result = await product_model_1.ProductModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found to update");
    }
    return result;
};
const deleteProductFromDB = async (id) => {
    const result = await product_model_1.ProductModel.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found to delete");
    }
    return result;
};
exports.ProductService = {
    createProductIntoDB,
    getAllProductsFromDB,
    getSingleProductBySlugFromDB,
    updateProductInDB,
    deleteProductFromDB,
};
