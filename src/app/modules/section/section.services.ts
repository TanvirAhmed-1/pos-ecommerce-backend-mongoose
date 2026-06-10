import { ProductModel } from "../product/product.model";
import { ISection } from "./section.interface";
import { SectionModel } from "./section.model";

const createSectionIntoDB = async (payload: ISection) => {
  if (payload.products && payload.products.length > 0) {
    const count = await ProductModel.countDocuments({ _id: { $in: payload.products } });
    if (count !== payload.products.length) {
      throw new Error("One or more product IDs are invalid!");
    }
  }
  const result = await SectionModel.create(payload);
  return result;
};

// হোমপেজের জন্য সব সেকশন একসাথে আনা (পপুলেটসহ)
const getHomeSectionsFromDB = async () => {
  return await SectionModel.find({ isActive: true })
    .sort({ displayOrder: 1 }) // ছোট থেকে বড় সাজাবে
    .populate({
      path: "products",
      match: { isActive: true }, // শুধু এনাবল প্রোডাক্টগুলো দেখাবে
      select: "name price thumbnail slug discountPrice", // শুধু দরকারি ডাটা
    });
};

const updateSectionInDB = async (id: string, payload: Partial<ISection>) => {
  if (payload.products && payload.products.length > 0) {
    const count = await ProductModel.countDocuments({ _id: { $in: payload.products } });
    if (count !== payload.products.length) {
      throw new Error("One or more product IDs are invalid!");
    }
  }

  const result = await SectionModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) throw new Error("Section not found to update!");
  return result;
};

const deleteSectionFromDB = async (id: string) => {
  const result = await SectionModel.findByIdAndDelete(id);
  if (!result) throw new Error("Section not found to delete!");
  return result;
};

export const SectionService = {
  createSectionIntoDB,
  getHomeSectionsFromDB,
  updateSectionInDB,
  deleteSectionFromDB,
};
