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
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: Schema.Types.Mixed, default: [] },
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
    name: { type: String, required: true, trim: true, default: "My Store" },
    companyName: { type: String, trim: true },
    companyTitle: { type: String, trim: true },
    phone: { type: String, default: "" },
    hotline: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    billFooter: { type: String, default: "" },
    bin: { type: String, default: "" },

    // Images
    logo: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    adminFavicon: { type: String, default: "" },
    careSectionBg: { type: String, default: "" },
    companyAboutImg: { type: String, default: "" },
    ogImg: { type: String, default: "" },
    loginBgImg: { type: String, default: "" },

    // External links & trackers
    websiteLink: { type: String, default: "" },
    facebookLink: { type: String, default: "" },
    googleTag: { type: String, default: "" },
    googleMap: { type: String, default: "" },
    facebookPixel: { type: String, default: "" },
    googleTagManager: { type: String, default: "" },
    googleAnalytics: { type: String, default: "" },
    appLink: { type: String, default: "" },
    iosLink: { type: String, default: "" },
    parentingLink: { type: String, default: "" },
    socialMedia: { type: [socialMediaSchema], default: [] },

    // SEO
    metaKeyword: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    seo: { type: seoSchema },

    // Maintenance
    comingSoon: { type: Boolean, default: false },
    comingSoonDate: { type: String, default: "" },

    // Footer & Content
    footerInfo: { type: String, default: "" },
    footerDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    copyright: { type: String, default: "" },

    // Theme branding
    primaryColor: { type: String, default: "#4f46e5" },
    secondaryColor: { type: String, default: "#10b981" },
    accentColor: { type: String, default: "#8b5cf6" },
    themeName: { type: String, default: "Royal Indigo" },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CompanyModel = model<ICompany>("Company", companySchema);
