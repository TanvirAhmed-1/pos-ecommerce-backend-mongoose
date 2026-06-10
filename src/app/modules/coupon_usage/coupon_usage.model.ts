import { Schema, model } from "mongoose";
import { ICouponUsage } from "./coupon_usage.interface";

const couponUsageSchema = new Schema<ICouponUsage>(
  {
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  },
  { timestamps: true }
);

export const CouponUsageModel = model<ICouponUsage>("CouponUsage", couponUsageSchema);
