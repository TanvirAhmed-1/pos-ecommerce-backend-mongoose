import { Schema, model } from "mongoose";
import { IMail } from "./mail.interface";

const mailSchema = new Schema<IMail>(
  {
    from: { type: String, required: true },
    to: [{ type: String, required: true }],
    subject: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ["custom", "newsletter", "notification", "order", "system"],
      default: "custom",
    },
    status: {
      type: String,
      enum: ["sent", "failed", "draft"],
      default: "sent",
    },
    sentBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    errorMessage: { type: String },
    recipientCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const MailModel = model<IMail>("Mail", mailSchema);
