import httpStatus from "http-status";
import mongoose from "mongoose";
import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";
import { CompanyModel } from "../company/company.model";
import { CategoryModel } from "../category/category.model";
import { Brand } from "../brand/brand.model";
import { VariantModel } from "../variant/variant.model";
import { AttributeModel } from "../attribute/attribute.model";
import AppError from "../../errors/AppError";
import { deleteFromCloudinary } from "../../utils/cloudinary";

const createProductIntoDB = async (payload: any) => {
  const { variants, ...productData } = payload;

  if (!productData.company) {
    const company = await CompanyModel.findOne({ isActive: true });
    if (!company) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Active company configuration not found! Please create a company configuration first."
      );
    }
    productData.company = company._id as any;
  } else {
    const companyExists = await CompanyModel.findById(productData.company);
    if (!companyExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Company not found!");
    }
  }

  // Category validation
  if (productData.category) {
    const categoryExists = await CategoryModel.findById(productData.category);
    if (!categoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
    }
  }

  // Subcategory validation
  if (productData.subcategory) {
    const subcategoryExists = await CategoryModel.findById(productData.subcategory);
    if (!subcategoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found!");
    }
  }

  // Brand validation
  if (productData.brand) {
    const brandExists = await Brand.findById(productData.brand);
    if (!brandExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Brand not found!");
    }
  }

  const result = await ProductModel.create(productData);

  // If variants are supplied and hasVariants is true, save them
  if (result && productData.hasVariants && Array.isArray(variants) && variants.length > 0) {
    // Auto-register custom attribute values that aren't in the attribute's values array
    for (const v of variants) {
      if (Array.isArray(v.attributes)) {
        for (const attrEntry of v.attributes) {
          if (attrEntry.attribute && attrEntry.value) {
            await AttributeModel.findByIdAndUpdate(attrEntry.attribute, {
              $addToSet: { values: attrEntry.value },
            });
          }
        }
      }
    }

    const variantDocs = variants.map((v: any) => ({
      ...v,
      product: result._id,
    }));
    await VariantModel.create(variantDocs);

    // Calculate total stock from all active variants
    const totalStockData = await VariantModel.aggregate([
      {
        $match: {
          product: result._id,
          isActive: true,
        },
      },
      { $group: { _id: "$product", total: { $sum: "$stock" } } },
    ]);
    const totalStock = totalStockData.length > 0 ? totalStockData[0].total : 0;
    await ProductModel.findByIdAndUpdate(result._id, { totalStock });
  } else if (result) {
    // If hasVariants is false, auto-create a default variant document
    await VariantModel.create({
      product: result._id,
      attributes: [],
      price: result.salePrice || result.basePrice,
      stock: result.totalStock || 0,
      sku: result.sku || `${result.slug.toUpperCase()}-DEF`,
      isActive: true,
      images: [result.thumbnail],
    });
  }

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

  // ২. ফিল্টারিং লজিক (সাপোর্ট আইডি এবং স্ল্যাগ)
  if (category) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(category as string);
    if (isObjectId) {
      filter.category = category;
    } else {
      const foundCategory = await CategoryModel.findOne({ slug: category });
      if (foundCategory) {
        filter.category = foundCategory._id;
      } else {
        filter.category = "000000000000000000000000";
      }
    }
  }

  if (subcategory) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(subcategory as string);
    if (isObjectId) {
      filter.subcategory = subcategory;
    } else {
      const foundSubcategory = await CategoryModel.findOne({ slug: subcategory });
      if (foundSubcategory) {
        filter.subcategory = foundSubcategory._id;
      } else {
        filter.subcategory = "000000000000000000000000";
      }
    }
  }

  if (brand) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(brand as string);
    if (isObjectId) {
      filter.brand = brand;
    } else {
      const foundBrand = await Brand.findOne({ slug: brand });
      if (foundBrand) {
        filter.brand = foundBrand._id;
      } else {
        filter.brand = "000000000000000000000000";
      }
    }
  }
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
    .populate({
      path: "productVariants",
      populate: {
        path: "attributes.attribute",
        select: "name",
      },
    })
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
    .populate({
      path: "productVariants",
      populate: {
        path: "attributes.attribute",
        select: "name",
      },
    });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found!");
  }

  const productObj = result.toObject();

  if (productObj.hasVariants && productObj.productVariants) {
    const attributeMap: Record<string, Set<string>> = {};
    productObj.productVariants.forEach((variant: any) => {
      if (!variant.isActive) return;
      variant.attributes?.forEach((attrEntry: any) => {
        const name = attrEntry.attribute?.name || "Option";
        if (name && attrEntry.value) {
          if (!attributeMap[name]) {
            attributeMap[name] = new Set<string>();
          }
          attributeMap[name].add(attrEntry.value);
        }
      });
    });

    const uniqueAttributes = Object.keys(attributeMap).map(name => ({
      name,
      values: Array.from(attributeMap[name])
    }));

    productObj.variantAttributes = uniqueAttributes;
  } else {
    productObj.variantAttributes = [];
  }

  return productObj;
};

const updateProductInDB = async (id: string, payload: any) => {
  const isExist = await ProductModel.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found to update");
  }

  const { variants, ...productData } = payload;

  // Company validation
  if (productData.company) {
    const companyExists = await CompanyModel.findById(productData.company);
    if (!companyExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Company not found!");
    }
  }

  // Category validation
  if (productData.category) {
    const categoryExists = await CategoryModel.findById(productData.category);
    if (!categoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
    }
  }

  // Subcategory validation
  if (productData.subcategory) {
    const subcategoryExists = await CategoryModel.findById(productData.subcategory);
    if (!subcategoryExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Subcategory not found!");
    }
  }

  // Brand validation
  if (productData.brand) {
    const brandExists = await Brand.findById(productData.brand);
    if (!brandExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Brand not found!");
    }
  }

  // Handle old thumbnail deletion if changed
  if (productData.thumbnail && isExist.thumbnail && isExist.thumbnail !== productData.thumbnail) {
    try {
      await deleteFromCloudinary(isExist.thumbnail);
    } catch (error) {
      console.error("Failed to delete old thumbnail from Cloudinary:", error);
    }
  }

  // Handle old images deletion if removed from array
  if (productData.images && isExist.images && isExist.images.length > 0) {
    const removedImages = isExist.images.filter((img) => !productData.images!.includes(img));
    for (const imgUrl of removedImages) {
      try {
        await deleteFromCloudinary(imgUrl);
      } catch (error) {
        console.error("Failed to delete removed product image from Cloudinary:", error);
      }
    }
  }

  const result = await ProductModel.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  });

  // Handle variants update
  if (productData.hasVariants !== undefined) {
    if (productData.hasVariants && Array.isArray(variants)) {
      // Delete existing variants
      await VariantModel.deleteMany({ product: id });

      // Auto-register custom attribute values
      for (const v of variants) {
        if (Array.isArray(v.attributes)) {
          for (const attrEntry of v.attributes) {
            if (attrEntry.attribute && attrEntry.value) {
              await AttributeModel.findByIdAndUpdate(attrEntry.attribute, {
                $addToSet: { values: attrEntry.value },
              });
            }
          }
        }
      }

      // Create new ones
      const variantDocs = variants.map((v: any) => ({
        ...v,
        product: id,
      }));
      await VariantModel.create(variantDocs);

      // Update product total stock
      const totalStockData = await VariantModel.aggregate([
        {
          $match: {
            product: new mongoose.Types.ObjectId(id),
            isActive: true,
          },
        },
        { $group: { _id: "$product", total: { $sum: "$stock" } } },
      ]);
      const totalStock = totalStockData.length > 0 ? totalStockData[0].total : 0;
      await ProductModel.findByIdAndUpdate(id, { totalStock });
    } else if (!productData.hasVariants) {
      // If hasVariants is turned off, delete all variants and create a single default variant
      await VariantModel.deleteMany({ product: id });
      const updatedProduct = await ProductModel.findById(id);
      if (updatedProduct) {
        await VariantModel.create({
          product: id,
          attributes: [],
          price: updatedProduct.salePrice || updatedProduct.basePrice,
          stock: updatedProduct.totalStock || 0,
          sku: updatedProduct.sku || `${updatedProduct.slug.toUpperCase()}-DEF`,
          isActive: true,
          images: [updatedProduct.thumbnail],
        });
      }
    }
  }

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

  // Delete all associated variants
  await VariantModel.deleteMany({ product: id });

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
