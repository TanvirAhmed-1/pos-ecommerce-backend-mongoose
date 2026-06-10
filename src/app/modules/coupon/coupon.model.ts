import { Schema, model } from "mongoose";
import { ICoupon } from "./coupon.interface";

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["flat", "percentage"], required: true },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

export const CouponModel = model<ICoupon>("Coupon", couponSchema);
