import { Document, Types } from "mongoose";

export interface IProductImage extends Document {
  product: Types.ObjectId;
  image: string;
}
