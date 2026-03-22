import slugify from "slugify";
import { ICategory } from "./category.interface";
import { CategoryModel } from "./category.model";

const createCategoryIntoDB = async (payload: ICategory) => {
  let level = 0;
  let ancestors: any[] = [];

  // যদি সাব-ক্যাটাগরি হয়, তবে প্যারেন্টের ডাটা চেক করবে
  if (payload.parentCategory) {
    const parent = await CategoryModel.findById(payload.parentCategory);
    if (!parent) throw new Error("Parent category not found!");

    level = parent.level + 1;
    ancestors = [...parent.ancestors, parent._id];
  }

  const slug = slugify(payload.name, { lower: true, strict: true });

  const result = await CategoryModel.create({
    ...payload,
    slug,
    level,
    ancestors,
  });
  return result;
};

// নেভিগেশনের জন্য শুধু Main Categories (Level 0)
const getNavCategories = async () => {
  return await CategoryModel.find({ level: 0, isActive: true })
    .select("name slug")
    .lean();
};

// হোমপেজে Featured সেকশনের জন্য
const getFeaturedCategories = async () => {
  return await CategoryModel.find({ isFeatured: true, isActive: true })
    .select("name slug")
    .lean();
};

const getAllCategories = async () => {
  return await CategoryModel.find()
    .populate("parentCategory", "name")
    .sort({ createdAt: -1 });
};

const deleteCategoryFromDB = async (id: string) => {
  const category = await CategoryModel.findById(id);
  if (!category) throw new Error("Category not found");

  // চেক করুন এই ক্যাটাগরির আন্ডারে কোনো চাইল্ড আছে কি না
  const hasChild = await CategoryModel.findOne({ parentCategory: id });
  if (hasChild) throw new Error("Cannot delete! This category has sub-categories.");

  return await CategoryModel.findByIdAndDelete(id);
};

export const CategoryService = {
  createCategoryIntoDB,
  getNavCategories,
  getFeaturedCategories,
  getAllCategories,
  deleteCategoryFromDB
};