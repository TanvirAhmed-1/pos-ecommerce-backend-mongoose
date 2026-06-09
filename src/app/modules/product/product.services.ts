import httpStatus from "http-status";
import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";
import { CompanyModel } from "../company/company.model";
import AppError from "../../errors/AppError";

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
  } = query;

  let filter: any = { isActive: true };
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
  const result = await ProductModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found to update");
  }
  return result;
};

const deleteProductFromDB = async (id: string) => {
  const result = await ProductModel.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found to delete");
  }
  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductBySlugFromDB,
  updateProductInDB,
  deleteProductFromDB,
};
