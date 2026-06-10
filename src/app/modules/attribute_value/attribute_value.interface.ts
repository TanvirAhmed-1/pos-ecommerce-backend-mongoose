import { Document, Types } from "mongoose";

export interface IAttributeValue extends Document {
  attribute: Types.ObjectId;
  value: string;
}
