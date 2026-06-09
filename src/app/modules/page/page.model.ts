import { Schema, model } from "mongoose";
import { IPage, ISEO } from "./page.interface";

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

const pageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    group: { type: String, required: true, default: "Quick Links" },
    isActive: { type: Boolean, default: true },
    seo: { type: seoSchema },
  },
  { timestamps: true }
);

// Indexing slug for fast lookups
pageSchema.index({ slug: 1 });

export const PageModel = model<IPage>("Page", pageSchema);
