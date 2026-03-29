import { Types } from "mongoose";

export interface IPayment {
  transactionId: string;
  gatewayTrxId?: string;
  order: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  currency: string;
  paymentGateway: "BKASH" | "NAGAD" | "SSL";
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  paymentData?: any;
}