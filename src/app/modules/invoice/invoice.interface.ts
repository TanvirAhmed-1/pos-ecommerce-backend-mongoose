import { Types } from "mongoose";

export interface IInvoice {
  invoiceNumber: string;
  order: Types.ObjectId;
  user: Types.ObjectId;
  payment?: Types.ObjectId;
  invoiceDate: Date;
  totalAmount: number;
  subtotal: number;
  discount: number;
  vat: number;
  deliveryCharge: number;
  paymentMethod: "bkash" | "nagad" | "cod" | "online_payment";
  paymentStatus: "pending" | "paid" | "failed" | "cancelled";
  items: {
    product: Types.ObjectId;
    variant: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
}
