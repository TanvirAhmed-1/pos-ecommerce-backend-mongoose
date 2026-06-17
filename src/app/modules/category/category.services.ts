import slugify from "slugify";
import { ICategory } from "./category.interface";
import { CategoryModel } from "./category.model";


const createCategoryIntoDB = async (payload: ICategory) => {
  let level = 0;
  let ancestors: any[] = [];
  if (payload.parentCategory) {
    const parent = await CategoryModel.findById(payload.parentCategory);
    if (!parent) throw new Error("Parent category not found!");

    level = parent.level + 1;
    ancestors = [...parent.ancestors, parent._id];
  }

  const slug = payload.slug
    ? slugify(payload.slug, { lower: true, strict: true })
    : slugify(payload.name, { lower: true, strict: true });

  const result = await CategoryModel.create({
    ...payload,
    slug,
    level,
    ancestors,
  });
  return result;
};

const getNavCategories = async () => {
  const allActiveCategories = await CategoryModel.find({ isActive: true }).lean();

  const categoryMap: Record<string, any> = {};
  allActiveCategories.forEach((cat) => {
    categoryMap[cat._id.toString()] = {
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      level: cat.level,
      title: cat.title,
      image: cat.image,
      isFeatured: cat.isFeatured,
      parentCategory: cat.parentCategory,
      children: [],
    };
  });

  const tree: any[] = [];

  allActiveCategories.forEach((cat) => {
    const currentCat = categoryMap[cat._id.toString()];

    if (cat.parentCategory) {
      const parentId = cat.parentCategory.toString();

      if (categoryMap[parentId]) {
        const { parentCategory, ...childData } = currentCat;
        categoryMap[parentId].children.push(childData);
      }
    } else {
      // Root/Main category (level === 0 or no parentCategory)
      if (cat.showInNavbar) {
        const { parentCategory, ...rootData } = currentCat;
        tree.push(rootData);
      }
    }
  });

  return tree;
};

// হোমপেজে Featured সেকশনের জন্য
// ফুটারে দেখানোর জন্য
const getFooterCategories = async () => {
  return await CategoryModel.find({ showInFooter: true, isActive: true })
    .select("name slug")
    .lean();
};

const getAllCategories = async () => {
  const allCategories = await CategoryModel.find().lean();

  const categoryMap: Record<string, any> = {};
  allCategories.forEach((cat) => {
    categoryMap[cat._id.toString()] = {
      ...cat,
      children: [],
    };
  });

  const tree: any[] = [];

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
    } else {
      // রুট ক্যাটাগরিগুলো সরাসরি ট্রিতে যাবে
      tree.push(currentCat);
    }
  });

  return tree;
};

const updateCategoryInDB = async (id: string, payload: Partial<any>) => {
  const isCategoryExists = await CategoryModel.findById(id);

  if (!isCategoryExists) {
    throw new Error("Category not found!");
  }

  const { name, parentId, slug, ...updateData } = payload;

  if (name) {
    updateData.name = name;
  }

  if (slug) {
    updateData.slug = slugify(slug, { lower: true, strict: true });
  } else if (name) {
    updateData.slug = slugify(name, { lower: true, strict: true });
  }

  if (parentId !== undefined) {
    if (parentId === null) {
      updateData.parentCategory = null;
      updateData.level = 0;
      updateData.ancestors = [];
    } else {
      const newParent = await CategoryModel.findById(parentId);
      if (!newParent) throw new Error("New parent category not found!");

      updateData.parentCategory = newParent._id;
      updateData.level = newParent.level + 1;
      updateData.ancestors = [...newParent.ancestors, newParent._id];
    }
  }

  const result = await CategoryModel.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
  });

  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const category = await CategoryModel.findById(id);
  if (!category) throw new Error("Category not found");

  const hasChild = await CategoryModel.findOne({ parentCategory: id });
  if (hasChild)
    throw new Error("Cannot delete! This category has sub-categories.");

  return await CategoryModel.findByIdAndDelete(id);
};

export const CategoryService = {
  createCategoryIntoDB,
  getNavCategories,
  getFooterCategories,
  getAllCategories,
  deleteCategoryFromDB,
  updateCategoryInDB,
};
