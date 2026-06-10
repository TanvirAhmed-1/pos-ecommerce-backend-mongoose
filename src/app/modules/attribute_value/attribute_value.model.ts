import { Schema, model } from "mongoose";
import { IAttributeValue } from "./attribute_value.interface";

const attributeValueSchema = new Schema<IAttributeValue>(
  {
    attribute: { type: Schema.Types.ObjectId, ref: "Attribute", required: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

export const AttributeValueModel = model<IAttributeValue>("AttributeValue", attributeValueSchema);
