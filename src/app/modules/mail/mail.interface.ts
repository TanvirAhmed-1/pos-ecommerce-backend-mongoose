import { Types } from "mongoose";

export interface IMail {
  from: string;
  to: string[];
  subject: string;
  body: string;
  type: "custom" | "newsletter" | "notification" | "order" | "system";
  status: "sent" | "failed" | "draft";
  sentBy: Types.ObjectId;
  errorMessage?: string;
  recipientCount: number;
}
