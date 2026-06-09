import { Schema, model } from "mongoose";
import { ICompany, ISEO, ISocialMedia } from "./company.interface";

const socialMediaSchema = new Schema<ISocialMedia>(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const seoSchema = new Schema<ISEO>(
  {
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: [String], default: [] },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
    twitterTitle: { type: String },
    twitterDescription: { type: String },
    twitterImage: { type: String },
    canonicalUrl: { type: String },
  },
  { _id: false }
);

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    favicon: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    socialMedia: { type: [socialMediaSchema], default: [] },
    googleMap: { type: String },
    seo: { type: seoSchema },
    description: { type: String },
    copyright: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CompanyModel = model<ICompany>("Company", companySchema);
