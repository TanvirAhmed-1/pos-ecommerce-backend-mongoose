import httpStatus from "http-status";
import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";
import { CompanyModel } from "../company/company.model";
import { CategoryModel } from "../category/category.model";
import { Brand } from "../brand/brand.model";
import AppError from "../../errors/AppError";
import { deleteFromCloudinary } from "../../utils/cloudinary";

const createProductIntoDB = async (payload: IProduct) => {
  if (!payload.company) {
    const company = await CompanyModel.findOne({ isActive: true });
    if (!company) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Active company configuration not found! Please create a company configuration first."
      );
    }
    payload.company = company._id as any;
  } else {
    const companyExists = await CompanyModel.findById(payload.company);
    if (!companyExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Company not found!");
    }
  }

  // Category validation
  if (payload.category) {
    const categoryExists = await CategoryModel.findById(payload.category);
    if (!categoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
    }
  }

  // Subcategory validation
  if (payload.subcategory) {
    const subcategoryExists = await CategoryModel.findById(payload.subcategory);
    if (!subcategoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found!");
    }
  }

  // Brand validation
  if (payload.brand) {
    const brandExists = await Brand.findById(payload.brand);
    if (!brandExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Brand not found!");
    }
  }

  const result = await ProductModel.create(payload);
  return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    category,
    subcategory,
    brand,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 20,
    admin,
  } = query;

  let filter: any = {};
  if (admin !== "true" && admin !== true) {
    filter.isActive = true;
  }
  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { slug: { $regex: searchTerm, $options: "i" } },
      { "seo.metaKeywords": { $in: [new RegExp(searchTerm as string, "i")] } }, 
    ];
  }

  // ২. ফিল্টারিং লজিক
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (brand) filter.brand = brand;
  if (query.visibility) filter.visibility = query.visibility;
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true" || query.isActive === true;
  }

  // ৩. প্রাইজ রেঞ্জ ফিল্টার
  if (minPrice || maxPrice) {
    filter.salePrice = {};
    if (minPrice) filter.salePrice.$gte = Number(minPrice);
    if (maxPrice) filter.salePrice.$lte = Number(maxPrice);
  }

  // ৪. পেজিনেশন লজিক (Skip and Limit)
  const skip = (Number(page) - 1) * Number(limit);

  const productQuery = ProductModel.find(filter)
    .populate("company", "name logo socialMedia email phone address")
    .populate("category", "name slug")
    .populate("brand", "name logo")
    .populate("productVariants")
    .skip(skip)
    .limit(Number(limit));

  // ৫. সর্টিং (Default: Newest first)
  if (sort) {
    productQuery.sort(sort as string);
  } else {
    productQuery.sort("-createdAt");
  }

  const result = await productQuery;
  const total = await ProductModel.countDocuments(filter);

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

const getSingleProductBySlugFromDB = async (slug: string) => {
  const result = await ProductModel.findOne({ slug, isActive: true })
    .populate("company", "name logo socialMedia email phone address")
    .populate("category")
    .populate("brand")
    .populate("productVariants");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found!");
  }
  return result;
};

const updateProductInDB = async (id: string, payload: Partial<IProduct>) => {
  const isExist = await ProductModel.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found to update");
  }

  // Company validation
  if (payload.company) {
    const companyExists = await CompanyModel.findById(payload.company);
    if (!companyExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Company not found!");
    }
  }

  // Category validation
  if (payload.category) {
    const categoryExists = await CategoryModel.findById(payload.category);
    if (!categoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
    }
  }

  // Subcategory validation
  if (payload.subcategory) {
    const subcategoryExists = await CategoryModel.findById(payload.subcategory);
    if (!subcategoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found!");
    }
  }

  // Brand validation
  if (payload.brand) {
    const brandExists = await Brand.findById(payload.brand);
    if (!brandExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Brand not found!");
    }
  }

  // Handle old thumbnail deletion if changed
  if (payload.thumbnail && isExist.thumbnail && isExist.thumbnail !== payload.thumbnail) {
    try {
      await deleteFromCloudinary(isExist.thumbnail);
    } catch (error) {
      console.error("Failed to delete old thumbnail from Cloudinary:", error);
    }
  }

  // Handle old images deletion if removed from array
  if (payload.images && isExist.images && isExist.images.length > 0) {
    const removedImages = isExist.images.filter((img) => !payload.images!.includes(img));
    for (const imgUrl of removedImages) {
      try {
        await deleteFromCloudinary(imgUrl);
      } catch (error) {
        console.error("Failed to delete removed product image from Cloudinary:", error);
      }
    }
  }

  const result = await ProductModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteProductFromDB = async (id: string) => {
  const isExist = await ProductModel.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found to delete");
  }

  // Delete thumbnail from Cloudinary
  if (isExist.thumbnail) {
    try {
      await deleteFromCloudinary(isExist.thumbnail);
    } catch (error) {
      console.error("Failed to delete product thumbnail from Cloudinary:", error);
    }
  }

  // Delete all images from Cloudinary
  if (isExist.images && isExist.images.length > 0) {
    for (const imgUrl of isExist.images) {
      try {
        await deleteFromCloudinary(imgUrl);
      } catch (error) {
        console.error("Failed to delete product image from Cloudinary:", error);
      }
    }
  }

  const result = await ProductModel.findByIdAndDelete(id);
  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductBySlugFromDB,
  updateProductInDB,
  deleteProductFromDB,
};
