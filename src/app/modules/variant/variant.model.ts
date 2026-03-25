import { Schema, model } from "mongoose";
import { IVariant } from "./variant.interface";

const variantSchema = new Schema<IVariant>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    attributeName: { type: String, required: true, trim: true },
    attributeValue: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

variantSchema.index({ sku: 1, product: 1 });

export const VariantModel = model<IVariant>("Variant", variantSchema);
