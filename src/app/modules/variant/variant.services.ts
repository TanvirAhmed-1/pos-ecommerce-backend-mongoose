import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { AttributeModel } from "../attribute/attribute.model";
import { ProductModel } from "../product/product.model";
import { IVariant } from "./variant.interface";
import { VariantModel } from "./variant.model";

const createVariantIntoDB = async (payload: IVariant) => {
  // ১. প্রোডাক্টের অস্তিত্ব চেক করা
  const productExists = await ProductModel.findById(payload.product);
  if (!productExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Product with ID ${payload.product} not found!`,
    );
  }

  for (const attr of payload.attributes) {
    const attributeExists = await AttributeModel.findById(attr.attribute);

    if (!attributeExists) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Attribute with ID ${attr.attribute} not found!`,
      );
    }

    if (!attributeExists.values.includes(attr.value)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Value "${attr.value}" is not valid for ${attributeExists.name}`,
      );
    }
  }

  // ২. সব ঠিক থাকলে ক্রিয়েট হবে
  const result = await VariantModel.create(payload);

  if (result) {
    await updateProductTotalStock(result.product.toString());
  }
  return result;
};

const getAllVariantsWithProductDetailsFromDB = async () => {
  const result = await VariantModel.find({ isActive: true })
    .populate({
      path: "product",
      select: "name slug image description",
    })
    .populate({
      path: "attributes.attribute",
      select: "name",
    });

  return result;
};

const updateProductTotalStock = async (productId: string) => {
  const totalStockData = await VariantModel.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        isActive: true,
      },
    },
    { $group: { _id: "$product", total: { $sum: "$stock" } } },
  ]);

  const totalStock = totalStockData.length > 0 ? totalStockData[0].total : 0;
  await ProductModel.findByIdAndUpdate(productId, { totalStock });
};

const getVariantsByProductFromDB = async (productId: string) => {
  return await VariantModel.find({ product: productId, isActive: true })
    .populate("attributes.attribute") // অ্যাট্রিবিউট ডিটেইলস (নাম) দেখাবে
    .populate("product", "name SKU");
};

const updateVariantInDB = async (id: string, payload: Partial<IVariant>) => {
  const result = await VariantModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Variant not found!");
  }

  if (payload.stock !== undefined) {
    await updateProductTotalStock(result.product.toString());
  }
  return result;
};

const deleteVariantFromDB = async (id: string) => {
  const variant = await VariantModel.findById(id);
  if (!variant) throw new AppError(httpStatus.NOT_FOUND, "Variant not found");

  const productId = variant.product.toString();
  await VariantModel.findByIdAndDelete(id);
  await updateProductTotalStock(productId);
  return null;
};

const updateVariantStockInDB = async (
  variantId: string,
  addedStock: number,
) => {
  const result = await VariantModel.findByIdAndUpdate(
    variantId,
    { $inc: { stock: addedStock } }, 
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Variant id not found!");
  }

  await updateProductTotalStock(result.product.toString());

  return result;
};

export const VariantService = {
  createVariantIntoDB,
  getVariantsByProductFromDB,
  updateVariantInDB,
  deleteVariantFromDB,
  getAllVariantsWithProductDetailsFromDB,
  updateVariantStockInDB,
};
