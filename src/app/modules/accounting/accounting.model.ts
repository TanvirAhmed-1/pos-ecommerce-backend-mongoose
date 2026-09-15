import { Schema, model } from "mongoose";
import { IAccountTransaction } from "./accounting.interface";

const accountTransactionSchema = new Schema<IAccountTransaction>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true,
      index: true,
    },
    category: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    account: { type: String, required: true, index: true },
    destinationAccount: { type: String },
    reference: { type: String, trim: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    date: { type: Date, default: Date.now, index: true },
    attachment: { type: String },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const AccountTransactionModel = model<IAccountTransaction>(
  "AccountTransaction",
  accountTransactionSchema
);
