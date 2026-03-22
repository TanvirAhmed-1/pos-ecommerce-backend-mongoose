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
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    address: { type: String },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
