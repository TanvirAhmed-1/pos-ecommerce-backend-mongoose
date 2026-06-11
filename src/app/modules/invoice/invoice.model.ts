import { Schema, model } from "mongoose";
import { IInvoice } from "./invoice.interface";

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    invoiceDate: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "cod", "online_payment"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        variant: { type: Schema.Types.ObjectId, ref: "Variant", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const InvoiceModel = model<IInvoice>("Invoice", invoiceSchema);
