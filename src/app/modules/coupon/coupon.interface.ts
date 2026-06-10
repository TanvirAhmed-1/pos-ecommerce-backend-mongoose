import { Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  type: "flat" | "percentage";
  value: number;
}
