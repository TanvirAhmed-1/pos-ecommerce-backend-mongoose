import { Schema, model } from "mongoose";
import { ISectionProduct } from "./section_product.interface";

const sectionProductSchema = new Schema<ISectionProduct>(
  {
    section: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

export const SectionProductModel = model<ISectionProduct>("SectionProduct", sectionProductSchema);
