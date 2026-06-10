import { Document, Types } from "mongoose";

export interface ICartItem extends Document {
  cart: Types.ObjectId;
  product: Types.ObjectId;
  variant: Types.ObjectId;
  quantity: number;
  price: number;
}
