import { Document, Types } from "mongoose";

export interface IOrderItem extends Document {
  order: Types.ObjectId;
  product: Types.ObjectId;
  variant: Types.ObjectId;
  quantity: number;
  price: number;
}
