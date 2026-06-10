import { Schema, model } from "mongoose";
import { IOrderItem } from "./order_item.interface";

const orderItemSchema = new Schema<IOrderItem>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: Schema.Types.ObjectId, ref: "Variant", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export const OrderItemModel = model<IOrderItem>("OrderItem", orderItemSchema);
