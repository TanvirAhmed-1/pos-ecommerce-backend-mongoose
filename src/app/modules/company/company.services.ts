import { CompanyModel } from "./company.model";

const getCompanyDetails = async () => {
  const company = await CompanyModel.findOne({ isActive: true });
  return company;
};

const upsertCompanyDetails = async (payload: any) => {
  if (payload.companyName && !payload.name) {
    payload.name = payload.companyName;
  }
  if (payload.name && !payload.companyName) {
    payload.companyName = payload.name;
  }
  if (payload.companyLogo && !payload.logo) {
    payload.logo = payload.companyLogo;
  }
  if (payload.logo && !payload.companyLogo) {
    payload.companyLogo = payload.logo;
  }

  const existingCompany = await CompanyModel.findOne();
  if (existingCompany) {
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      existingCompany._id,
      { $set: payload },
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
