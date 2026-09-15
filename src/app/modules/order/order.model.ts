import { Schema, model } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variant: {
          type: Schema.Types.ObjectId,
          ref: "Variant",
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    payment: {
      method: {
        type: String,
        enum: ["bkash", "nagad", "cod", "online_payment", "cash", "card", "pos", "bank_transfer"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "cancelled"],
        default: "pending",
      },
      transactionId: { type: String },
      date: { type: Date },
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryType: {
      type: String,
      enum: ["home_delivery", "pickup", "pos_takeaway"],
      default: "home_delivery",
    },
    // New Design Fields
    orderNumber: { type: String },
    address: { type: Schema.Types.ObjectId, ref: "Address" },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    paymentStatus: { type: String, default: "pending" },
    notes: { type: String },
    source: { type: String, enum: ["web", "pos", "admin"], default: "web" },
  },
  { timestamps: true },
);

export const OrderModel = model<IOrder>("Order", orderSchema);

