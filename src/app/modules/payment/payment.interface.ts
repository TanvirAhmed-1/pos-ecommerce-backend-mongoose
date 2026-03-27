import { Types } from "mongoose";

export type IPaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export interface IPayment {
  transactionId: string;    // আপনার সিস্টেমের আইডি
  gatewayTrxId?: string;    // বিকাশের দেওয়া আইডি (trxID)
  order: Types.ObjectId;    // কোন অর্ডারের পেমেন্ট
  user: Types.ObjectId;
  amount: number;
  currency: string;
  paymentGateway: "BKASH" | "NAGAD" | "SSL";
  status: IPaymentStatus;
  paymentData?: any;        // বিকাশের পুরো রেসপন্স সেভ রাখার জন্য
}