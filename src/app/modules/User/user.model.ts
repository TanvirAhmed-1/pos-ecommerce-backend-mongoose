import { IUser } from "./user.interface";
import mongoose, { Schema } from "mongoose";

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "reseller", "admin", "superadmin"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    companyName: { type: String },
    tradeLicense: { type: String },
    resellerDiscount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
