import { Schema, model } from "mongoose";
import { IVariantAttribute } from "./variant_attribute.interface";

const variantAttributeSchema = new Schema<IVariantAttribute>(
  {
    variant: { type: Schema.Types.ObjectId, ref: "Variant", required: true },
    attribute: { type: Schema.Types.ObjectId, ref: "Attribute", required: true },
    attributeValue: { type: Schema.Types.ObjectId, ref: "AttributeValue", required: true },
  },
  { timestamps: true }
);

export const VariantAttributeModel = model<IVariantAttribute>("VariantAttribute", variantAttributeSchema);
