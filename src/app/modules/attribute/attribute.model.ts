import { Schema, model } from "mongoose";
import { IAttribute } from "./attribute.interface";

const attributeSchema = new Schema<IAttribute>(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    values: [{ 
      type: String, 
      required: true,
      trim: true
    }],
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true }
);

export const AttributeModel = model<IAttribute>("Attribute", attributeSchema);
