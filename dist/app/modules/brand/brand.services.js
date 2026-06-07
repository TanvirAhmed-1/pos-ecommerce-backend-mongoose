"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandService = void 0;
const brand_model_1 = require("./brand.model");
const slugify_1 = __importDefault(require("slugify"));
const createBrandIntoDB = async (payload) => {
    const isExist = await brand_model_1.Brand.findOne({ name: payload.name });
    if (isExist) {
        throw new Error("Brand already exists");
    }
    //slug create
    if (payload.name) {
        payload.slug = (0, slugify_1.default)(payload.name, {
            lower: true,
            strict: true,
            replacement: "-",
        });
    }
    const result = await brand_model_1.Brand.create(payload);
    return result;
};
const getAllBrandsFromDB = async () => {
    return await brand_model_1.Brand.find().sort({ name: 1 });
};
const getSingleBrandFromDB = async (id) => {
    return await brand_model_1.Brand.findById(id);
};
const updateBrandInDB = async (id, payload) => {
    return await brand_model_1.Brand.findByIdAndUpdate(id, payload, {
        returnDocument: "after",
        runValidators: true,
    });
};
const deleteBrandFromDB = async (id) => {
    const isExist = await brand_model_1.Brand.findById(id);
    if (!isExist) {
        throw new Error("Brand not found");
    }
    const result = await brand_model_1.Brand.findByIdAndDelete(id);
    return result;
};
exports.BrandService = {
    createBrandIntoDB,
    getAllBrandsFromDB,
    getSingleBrandFromDB,
    updateBrandInDB,
    deleteBrandFromDB,
};
