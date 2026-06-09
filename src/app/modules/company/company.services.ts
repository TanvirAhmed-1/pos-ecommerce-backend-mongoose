import { ICompany } from "./company.interface";
import { CompanyModel } from "./company.model";

const getCompanyDetails = async () => {
  const company = await CompanyModel.findOne({ isActive: true });
  return company;
};

const upsertCompanyDetails = async (payload: ICompany) => {
  // We search for any existing company profile first. If found, we update it. Otherwise, we create a new one.
  const existingCompany = await CompanyModel.findOne();
  if (existingCompany) {
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
