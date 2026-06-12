import { IBrand } from "./brand.interface";
import { Brand } from "./brand.model";
import slugify from "slugify";
import { deleteFromCloudinary } from "../../utils/cloudinary";

const createBrandIntoDB = async (payload: IBrand) => {
  const isExist = await Brand.findOne({ name: payload.name });
  if (isExist) {
    throw new Error("Brand already exists");
  }
  //slug create
  if (payload.name) {
    payload.slug = slugify(payload.name, {
      lower: true,
      strict: true,
      replacement: "-",
    });
  }

  const result = await Brand.create(payload);
  return result;
};

const getAllBrandsFromDB = async () => {
  return await Brand.find().sort({ name: 1 });
};

const getSingleBrandFromDB = async (id: string) => {
  return await Brand.findById(id);
};

const updateBrandInDB = async (id: string, payload: Partial<IBrand>) => {
  const isExist = await Brand.findById(id);
  if (!isExist) {
    throw new Error("Brand not found to update");
  }

  // If logo is changed, delete the old logo from Cloudinary
  if (payload.logo && isExist.logo && isExist.logo !== payload.logo) {
    try {
      await deleteFromCloudinary(isExist.logo);
    } catch (error) {
      console.error("Failed to delete old logo from Cloudinary:", error);
    }
  }

  const result = await Brand.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  });
  return result;
};

const deleteBrandFromDB = async (id: string) => {
  const isExist = await Brand.findById(id);
  if (!isExist) {
    throw new Error("Brand not found");
  }

  // Delete the logo from Cloudinary
  if (isExist.logo) {
    try {
      await deleteFromCloudinary(isExist.logo);
    } catch (error) {
      console.error("Failed to delete brand logo from Cloudinary:", error);
    }
  }

  const result = await Brand.findByIdAndDelete(id);
  return result;
};

export const BrandService = {
  createBrandIntoDB,
  getAllBrandsFromDB,
  getSingleBrandFromDB,
  updateBrandInDB,
  deleteBrandFromDB,
};
