import { Document, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  message: string;
  images: string[];
  isVerified?: boolean;
  status: "active" | "hidden";
}
