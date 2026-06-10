import { Schema, model } from "mongoose";
import { ICartItem } from "./cart_item.interface";

const cartItemSchema = new Schema<ICartItem>(
  {
    cart: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: Schema.Types.ObjectId, ref: "Variant", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export const CartItemModel = model<ICartItem>("CartItem", cartItemSchema);
