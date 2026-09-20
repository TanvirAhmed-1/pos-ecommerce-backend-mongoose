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
      subtitle: cat.subtitle,
      banner: cat.banner,
      description: cat.description,
      image: cat.image,
      isFeatured: cat.isFeatured,
      showInNavbar: cat.showInNavbar,
      parentCategory: cat.parentCategory,
      children: [],
    };
  });

  const tree: any[] = [];
  const hasSpecificNavFlag = allActiveCategories.some((c) => !c.parentCategory && c.showInNavbar);

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
      if (!hasSpecificNavFlag || cat.showInNavbar) {
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

const getAllCategories = async (query: Record<string, unknown> = {}) => {
  const {
    searchTerm,
    search,
    isActive,
    showInNavbar,
    showInFooter,
    isFeatured,
    page = 1,
    limit = 20,
    isAll,
  } = query;

  const filter: any = {};

  const searchKey = (searchTerm || search) as string | undefined;
  if (searchKey && typeof searchKey === "string" && searchKey.trim()) {
    filter.$or = [
      { name: { $regex: searchKey.trim(), $options: "i" } },
      { slug: { $regex: searchKey.trim(), $options: "i" } },
      { title: { $regex: searchKey.trim(), $options: "i" } },
      { subtitle: { $regex: searchKey.trim(), $options: "i" } },
    ];
  }

  if (isActive !== undefined && isActive !== "" && isActive !== "all") {
    filter.isActive = isActive === "true" || isActive === true;
  }

  if (showInNavbar !== undefined && showInNavbar !== "" && showInNavbar !== "all") {
    filter.showInNavbar = showInNavbar === "true" || showInNavbar === true;
  }

  if (showInFooter !== undefined && showInFooter !== "" && showInFooter !== "all") {
    filter.showInFooter = showInFooter === "true" || showInFooter === true;
  }

  if (isFeatured !== undefined && isFeatured !== "" && isFeatured !== "all") {
    filter.isFeatured = isFeatured === "true" || isFeatured === true;
  }

  // 1. Fetch all matching categories
  const allMatching = await CategoryModel.find(filter)
    .populate("parentCategory", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  // 2. Build hierarchical ordered list (Parent followed by its direct children and subchildren)
  const hierarchicalList: any[] = [];
  const addedIds = new Set<string>();

  const buildTree = (parentId: string | null = null) => {
    const directChildren = allMatching.filter((cat: any) => {
      if (parentId === null) {
        return !cat.parentCategory;
      }
      const pId =
        typeof cat.parentCategory === "object" && cat.parentCategory !== null
          ? cat.parentCategory._id?.toString()
          : cat.parentCategory?.toString();
      return pId === parentId;
    });

    directChildren.forEach((child: any) => {
      const childId = child._id.toString();
      const hasChildren = allMatching.some((c: any) => {
        const pId =
          typeof c.parentCategory === "object" && c.parentCategory !== null
            ? c.parentCategory._id?.toString()
            : c.parentCategory?.toString();
        return pId === childId;
      });

      hierarchicalList.push({
        ...child,
        hasChildren,
      });
      addedIds.add(childId);
      buildTree(childId);
    });
  };

  buildTree(null);

  // If some orphan or filtered items were not attached to a root in this result set, append them
  allMatching.forEach((c: any) => {
    const cId = c._id.toString();
    if (!addedIds.has(cId)) {
      hierarchicalList.push({
        ...c,
        hasChildren: false,
      });
      addedIds.add(cId);
    }
  });

  const total = hierarchicalList.length;

  if (isAll === "true" || isAll === true || limit === "0" || limit === "all") {
    return {
      meta: {
        page: 1,
        limit: total,
        total,
        totalPage: 1,
      },
      data: hierarchicalList,
    };
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Number(limit) || 20);
  const skip = (pageNum - 1) * limitNum;
  const paginatedResult = hierarchicalList.slice(skip, skip + limitNum);

  return {
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPage: Math.ceil(total / limitNum),
    },
    data: paginatedResult,
  };
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
