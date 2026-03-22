import { Schema, model } from "mongoose";
import { ISection } from "./section.interface";

const sectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product", // আপনার Product মডেলের সাথে রিলেশন
      },
    ],
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const SectionModel = model<ISection>("Section", sectionSchema);
