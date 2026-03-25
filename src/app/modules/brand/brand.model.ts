import { Schema, model } from "mongoose";
import { IBrand } from "./brand.interface";

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    logo: { type: String, required: true }, // Cloudinary URL
    description: { type: String, trim: true },
    website: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Brand = model<IBrand>("Brand", brandSchema);
