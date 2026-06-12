import { ICompany } from "./company.interface";
import { CompanyModel } from "./company.model";
import { deleteFromCloudinary } from "../../utils/cloudinary";

const getCompanyDetails = async () => {
  const company = await CompanyModel.findOne({ isActive: true });
  return company;
};

const upsertCompanyDetails = async (payload: ICompany) => {
  // We search for any existing company profile first. If found, we update it. Otherwise, we create a new one.
  const existingCompany = await CompanyModel.findOne();
  if (existingCompany) {
    // Delete old logo from Cloudinary if changed
    if (payload.logo && existingCompany.logo && existingCompany.logo !== payload.logo) {
      try {
        await deleteFromCloudinary(existingCompany.logo);
      } catch (error) {
        console.error("Failed to delete old company logo from Cloudinary:", error);
      }
    }

    // Delete old favicon from Cloudinary if changed
    if (payload.favicon && existingCompany.favicon && existingCompany.favicon !== payload.favicon) {
      try {
        await deleteFromCloudinary(existingCompany.favicon);
      } catch (error) {
        console.error("Failed to delete old company favicon from Cloudinary:", error);
      }
    }

    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      existingCompany._id,
      payload,
      { new: true, runValidators: true }
    );
    return updatedCompany;
  }

  const newCompany = await CompanyModel.create(payload);
  return newCompany;
};

export const CompanyServices = {
  getCompanyDetails,
  upsertCompanyDetails,
};
