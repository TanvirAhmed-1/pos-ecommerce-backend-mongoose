import { Document, Types } from "mongoose";

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: {
    product: Types.ObjectId;
    variant: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  payment: {
    method: "bkash" | "nagad" | "cod" | "online_payment";
    status: "pending" | "paid" | "failed" | "cancelled";
    transactionId?: string;
    date?: Date;
  };
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  deliveryType: "home_delivery" | "pickup";
  // New Design Fields
  orderNumber?: string;
  address?: Types.ObjectId;
  subtotal?: number;
  discount?: number;
  vat?: number;
  deliveryCharge?: number;
  paymentStatus?: string;
}
