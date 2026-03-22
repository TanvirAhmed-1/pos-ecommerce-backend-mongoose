import { Document, Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  variant: Types.ObjectId;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  totalAmount: number;
}
