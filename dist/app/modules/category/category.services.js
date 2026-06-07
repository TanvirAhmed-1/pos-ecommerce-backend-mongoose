"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const category_model_1 = require("./category.model");
const createCategoryIntoDB = async (payload) => {
    let level = 0;
    let ancestors = [];
    if (payload.parentCategory) {
        const parent = await category_model_1.CategoryModel.findById(payload.parentCategory);
        if (!parent)
            throw new Error("Parent category not found!");
        level = parent.level + 1;
        ancestors = [...parent.ancestors, parent._id];
    }
    const slug = (0, slugify_1.default)(payload.name, { lower: true, strict: true });
    const result = await category_model_1.CategoryModel.create({
        ...payload,
        slug,
        level,
        ancestors,
    });
    return result;
};
// নেভিগেশনের জন্য শুধু Main Categories (Level 0)
const getNavCategories = async () => {
    return await category_model_1.CategoryModel.find({ level: 0, isActive: true })
        .select("name slug")
        .lean();
};
// হোমপেজে Featured সেকশনের জন্য
const getFeaturedCategories = async () => {
    return await category_model_1.CategoryModel.find({ isFeatured: true, isActive: true })
        .select("name slug")
        .lean();
};
const getAllCategories = async () => {
    const allCategories = await category_model_1.CategoryModel.find().lean();
    const categoryMap = {};
    allCategories.forEach((cat) => {
        categoryMap[cat._id.toString()] = {
            ...cat,
            children: [],
        };
    });
    const tree = [];
    // ২. ট্রিতে কনভার্ট করার সময় চাইল্ড থেকে parentCategory সরিয়ে ফেলা
    allCategories.forEach((cat) => {
        const currentCat = categoryMap[cat._id.toString()];
        if (cat.parentCategory) {
            const parentId = cat.parentCategory.toString();
            if (categoryMap[parentId]) {
                // চাইল্ড হিসেবে পুশ করার আগে parentCategory ফিল্ডটি ডিলিট করে দিন
                const { parentCategory, ...childData } = currentCat;
                categoryMap[parentId].children.push(childData);
            }
        }
        else {
            // রুট ক্যাটাগরিগুলো সরাসরি ট্রিতে যাবে
            tree.push(currentCat);
        }
    });
    return tree;
};
const updateCategoryInDB = async (id, payload) => {
    const isCategoryExists = await category_model_1.CategoryModel.findById(id);
    if (!isCategoryExists) {
        throw new Error("Category not found!");
    }
    const { name, parentId, ...updateData } = payload;
    if (name) {
        updateData.name = name;
        updateData.slug = (0, slugify_1.default)(name, { lower: true, strict: true });
    }
    if (parentId !== undefined) {
        if (parentId === null) {
            updateData.parentCategory = null;
            updateData.level = 0;
            updateData.ancestors = [];
        }
        else {
            const newParent = await category_model_1.CategoryModel.findById(parentId);
            if (!newParent)
                throw new Error("New parent category not found!");
            updateData.parentCategory = newParent._id;
            updateData.level = newParent.level + 1;
            updateData.ancestors = [...newParent.ancestors, newParent._id];
        }
        // নোট: এখানে একটি recursive function দরকার হতে পারে যদি আপনি চান
        // এই ক্যাটাগরির চাইল্ডদেরও অটোমেটিক আপডেট করতে।
    }
    const result = await category_model_1.CategoryModel.findByIdAndUpdate(id, updateData, {
        returnDocument: "after",
        runValidators: true,
    });
    return result;
};
const deleteCategoryFromDB = async (id) => {
    const category = await category_model_1.CategoryModel.findById(id);
    if (!category)
        throw new Error("Category not found");
    const hasChild = await category_model_1.CategoryModel.findOne({ parentCategory: id });
    if (hasChild)
        throw new Error("Cannot delete! This category has sub-categories.");
    return await category_model_1.CategoryModel.findByIdAndDelete(id);
};
exports.CategoryService = {
    createCategoryIntoDB,
    getNavCategories,
    getFeaturedCategories,
    getAllCategories,
    deleteCategoryFromDB,
    updateCategoryInDB,
};
