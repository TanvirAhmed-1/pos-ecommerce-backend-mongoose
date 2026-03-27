import { Schema, model } from "mongoose";
import { IPayment } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    transactionId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    gatewayTrxId: { 
      type: String 
    },
    order: { 
      type: Schema.Types.ObjectId, 
      ref: "Order", 
      required: true 
    },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    currency: { 
      type: String, 
      default: "BDT" 
    },
    paymentGateway: { 
      type: String, 
      enum: ["BKASH", "NAGAD", "SSL"], 
      default: "BKASH" 
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "CANCELLED"],
      default: "PENDING",
    },
    paymentData: { 
      type: Object 
    },
  },
  { 
    timestamps: true 
  }
);

export const PaymentModel = model<IPayment>("Payment", paymentSchema);