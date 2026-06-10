import { Document, Types } from "mongoose";

export interface IAddress extends Document {
  user: Types.ObjectId;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  isDefault: boolean;
}
