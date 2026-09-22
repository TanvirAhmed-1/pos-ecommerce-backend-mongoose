import httpStatus from "http-status";
import mongoose from "mongoose";
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
    // Auto-register custom attribute values and resolve ObjectIds
    for (const v of variants) {
      if (Array.isArray(v.attributes)) {
        for (let i = 0; i < v.attributes.length; i++) {
          const attrEntry = v.attributes[i];
          let attrId = attrEntry.attribute?._id || attrEntry.attribute;
          const attrName =
            attrEntry.name ||
            attrEntry.attribute?.name ||
            (typeof attrId === "string" && !mongoose.Types.ObjectId.isValid(attrId) ? attrId : null);

          if (attrName) {
            let attrDoc = await AttributeModel.findOne({
              name: new RegExp(`^${attrName.trim()}$`, "i"),
            });
            if (!attrDoc) {
              attrDoc = await AttributeModel.create({
                name: attrName.trim(),
                values: [attrEntry.value].filter(Boolean),
              });
            } else if (attrEntry.value) {
              await AttributeModel.findByIdAndUpdate(attrDoc._id, {
                $addToSet: { values: attrEntry.value },
              });
            }
            attrId = attrDoc._id;
          } else if (attrId && mongoose.Types.ObjectId.isValid(attrId) && attrEntry.value) {
            await AttributeModel.findByIdAndUpdate(attrId, {
              $addToSet: { values: attrEntry.value },
            });
          }

          v.attributes[i] = {
            attribute: attrId,
            value: attrEntry.value,
          };
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
      { sku: { $regex: searchTerm, $options: "i" } },
      { productCode: { $regex: searchTerm, $options: "i" } },
      { barcode: { $regex: searchTerm, $options: "i" } },
      { "seo.metaKeywords": { $in: [new RegExp(searchTerm as string, "i")] } },
    ];
  }

  // ২. ফিল্টারিং লজিক (সাপোর্ট আইডি, স্ল্যাগ এবং নাম)
  if (category) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(category as string);
    if (isObjectId) {
      const subCats = await CategoryModel.find({ parent: category });
      if (subCats.length > 0) {
        filter.category = { $in: [category, ...subCats.map((c) => c._id)] };
      } else {
        filter.category = category;
      }
    } else {
      const foundCategory = await CategoryModel.findOne({
        $or: [
          { slug: category },
          { name: new RegExp(`^${(category as string).replace(/[-_]/g, " ")}$`, "i") },
          { name: new RegExp(`^${category}$`, "i") },
        ],
      });
      if (foundCategory) {
        const subCats = await CategoryModel.find({ parent: foundCategory._id });
        if (subCats.length > 0) {
          filter.category = { $in: [foundCategory._id, ...subCats.map((c) => c._id)] };
        } else {
          filter.category = foundCategory._id;
        }
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
      const foundSubcategory = await CategoryModel.findOne({
        $or: [
          { slug: subcategory },
          { name: new RegExp(`^${(subcategory as string).replace(/[-_]/g, " ")}$`, "i") },
          { name: new RegExp(`^${subcategory}$`, "i") },
        ],
      });
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
    .select("-company -purchasePrice -resellerPrice -warranty -__v")
    .populate("category", "_id name slug")
    .populate("subcategory", "_id name slug")
    .populate("brand", "_id name slug logo")
    .populate({
      path: "productVariants",
      select: "_id sku price stock images attributes isActive",
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

  const rawResult = await productQuery;
  const total = await ProductModel.countDocuments(filter);

  const cleanResult = rawResult.map((prod) => {
    const p = prod.toObject() as any;
    delete p.company;
    delete p.socialMedia;
    delete p.purchasePrice;
    delete p.resellerPrice;
    delete p.warranty;
    delete p.__v;

    if (p.hasVariants && Array.isArray(p.productVariants)) {
      p.productVariants = p.productVariants
        .filter((v: any) => v.isActive !== false)
        .map((variant: any) => ({
          _id: variant._id,
          sku: variant.sku,
          price: variant.price,
          stock: variant.stock,
          images: variant.images || [],
          attributes: (variant.attributes || []).map((attrEntry: any) => ({
            name: attrEntry.attribute?.name || attrEntry.name || "Option",
            value: attrEntry.value,
          })),
          isActive: variant.isActive !== false,
        }));
    } else {
      p.productVariants = [];
    }
    return p;
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: cleanResult,
  };
};

const getSingleProductBySlugFromDB = async (slug: string) => {
  const result = await ProductModel.findOne({ slug, isActive: true })
    .select("-company -purchasePrice -resellerPrice -warranty -isRecommended -isCategoryProduct -isTopSelling -createdAt -updatedAt -__v")
    .populate("category", "_id name slug")
    .populate("subcategory", "_id name slug")
    .populate("brand", "_id name slug logo")
    .populate({
      path: "productVariants",
      select: "_id sku price stock images attributes isActive",
      populate: {
        path: "attributes.attribute",
        select: "name",
      },
    });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found!");
  }

  const productObj = result.toObject() as any;

  // Strip unneeded fields from the single product detail response
  delete productObj.company;
  delete productObj.socialMedia;
  delete productObj.purchasePrice;
  delete productObj.resellerPrice;
  delete productObj.warranty;
  delete productObj.isRecommended;
  delete productObj.isCategoryProduct;
  delete productObj.isTopSelling;
  delete productObj.createdAt;
  delete productObj.updatedAt;
  delete productObj.__v;

  // Format clean productVariants & variantAttributes
  if (productObj.hasVariants && Array.isArray(productObj.productVariants)) {
    const cleanVariants: any[] = [];
    const attributeMap: Record<string, Set<string>> = {};

    productObj.productVariants.forEach((variant: any) => {
      if (variant.isActive === false) return;

      const cleanAttributes = (variant.attributes || []).map((attrEntry: any) => {
        const attrName = attrEntry.attribute?.name || attrEntry.name || "Option";
        const attrVal = attrEntry.value;

        if (attrName && attrVal) {
          if (!attributeMap[attrName]) {
            attributeMap[attrName] = new Set<string>();
          }
          attributeMap[attrName].add(attrVal);
        }

        return {
          name: attrName,
          value: attrVal,
        };
      });

      cleanVariants.push({
        _id: variant._id,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        images: variant.images || [],
        attributes: cleanAttributes,
        isActive: variant.isActive !== false,
      });
    });

    productObj.productVariants = cleanVariants;
    productObj.variantAttributes = Object.keys(attributeMap).map((name) => ({
      name,
      values: Array.from(attributeMap[name]),
    }));
  } else {
    productObj.productVariants = [];
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

      // Auto-register custom attribute values and resolve ObjectIds
      for (const v of variants) {
        if (Array.isArray(v.attributes)) {
          for (let i = 0; i < v.attributes.length; i++) {
            const attrEntry = v.attributes[i];
            let attrId = attrEntry.attribute?._id || attrEntry.attribute;
            const attrName =
              attrEntry.name ||
              attrEntry.attribute?.name ||
              (typeof attrId === "string" && !mongoose.Types.ObjectId.isValid(attrId) ? attrId : null);

            if (attrName) {
              let attrDoc = await AttributeModel.findOne({
                name: new RegExp(`^${attrName.trim()}$`, "i"),
              });
              if (!attrDoc) {
                attrDoc = await AttributeModel.create({
                  name: attrName.trim(),
                  values: [attrEntry.value].filter(Boolean),
                });
              } else if (attrEntry.value) {
                await AttributeModel.findByIdAndUpdate(attrDoc._id, {
                  $addToSet: { values: attrEntry.value },
                });
              }
              attrId = attrDoc._id;
            } else if (attrId && mongoose.Types.ObjectId.isValid(attrId) && attrEntry.value) {
              await AttributeModel.findByIdAndUpdate(attrId, {
                $addToSet: { values: attrEntry.value },
              });
            }

            v.attributes[i] = {
              attribute: attrId,
              value: attrEntry.value,
            };
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
