import { Document, Types } from "mongoose";

export interface IVariantAttribute extends Document {
  variant: Types.ObjectId;
  attribute: Types.ObjectId;
  attributeValue: Types.ObjectId;
}
