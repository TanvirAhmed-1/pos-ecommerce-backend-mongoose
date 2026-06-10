import { Document, Types } from "mongoose";

export interface ISectionProduct extends Document {
  section: Types.ObjectId;
  product: Types.ObjectId;
}
