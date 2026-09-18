import { Schema, model } from "mongoose";
import { IBanner } from "./banner.interface";

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    buttonText: { type: String, default: "Explore Now" },
    buttonLink: { type: String, default: "/products" },
    imageUrl: { type: String, required: true },
    bgColor: { type: String, default: "#003820" },
    textColor: { type: String, default: "#ffffff" },
    badgeColor: { type: String, default: "#b0f1c7" },
    buttonBgColor: { type: String, default: "#fd651e" },
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bannerSchema.index({ priority: 1, isActive: 1 });

export const BannerModel = model<IBanner>("Banner", bannerSchema);
