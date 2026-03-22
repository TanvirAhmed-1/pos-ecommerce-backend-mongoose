import { IVariant } from "./variant.interface";
import { VariantModel } from "./variant.model";

const createVariantIntoDB = async (payload: IVariant) => {
  return await VariantModel.create(payload);
};

const getVariantsByProductFromDB = async (productId: string) => {
  const result = await VariantModel.find({
    product: productId,
    isActive: true,
  });

  if (!result || result.length === 0) {
    throw new Error("No variants found for this product");
  }
  return result;
};

// সরাসরি findByIdAndUpdate ব্যবহার করা ভালো (একক কুয়েরিতে কাজ শেষ)
const updateVariantInDB = async (variantId: string, newStock: number) => {
  const result = await VariantModel.findByIdAndUpdate(
    variantId,
    { stock: newStock },
    { new: true, runValidators: true },
  ).populate("product", "name slug");

  if (!result) {
    throw new Error("Variant not found to update");
  }
  return result;
};

const updateStockToOrderInDB = async (id: string, quantity: number) => {
  const result = await VariantModel.findOneAndUpdate(
    { _id: id, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true },
  );
  if (!result) throw new Error("Insufficient stock or Variant not found");
  return result;
};

const deleteVariantFromDB = async (id: string) => {
  const result = await VariantModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("Variant not found to delete");
  }
  return result;
};

export const VariantService = {
  createVariantIntoDB,
  getVariantsByProductFromDB,
  updateVariantInDB,
  updateStockToOrderInDB,
  deleteVariantFromDB,
};
