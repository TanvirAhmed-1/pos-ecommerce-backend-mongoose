import { Document, Types } from "mongoose";

export interface IOrder extends Document {
  user?: Types.ObjectId;
  items: {
    product: Types.ObjectId;
    variant?: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city?: string;
    district?: string;
    upazila?: string;
    division?: string;
  };
  payment: {
    method: "bkash" | "nagad" | "cod" | "online_payment" | "cash" | "card" | "pos" | "bank_transfer";
    status: "pending" | "paid" | "failed" | "cancelled";
    transactionId?: string;
    date?: Date;
  };
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  deliveryType: "home_delivery" | "pickup" | "pos_takeaway";
  // New Design Fields
  orderNumber?: string;
  address?: Types.ObjectId;
  subtotal?: number;
  discount?: number;
  vat?: number;
  deliveryCharge?: number;
  paymentStatus?: string;
  notes?: string;
  source?: "web" | "pos" | "admin";
  alternativePhone?: string;
  courier?: string;
  callStatus?: "pending" | "confirmed" | "no_answer" | "call_later" | "cancelled" | "wrong_number";
  callAttempts?: number;
  callLogs?: {
    callStatus: string;
    note?: string;
    agentName?: string;
    date: Date;
  }[];
  confirmedBy?: {
    name: string;
    email?: string;
    date: Date;
  };
}

