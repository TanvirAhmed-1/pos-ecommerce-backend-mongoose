import { Document, Types } from "mongoose";

export interface IInventoryLog extends Document {
  product: Types.ObjectId;
  variant: Types.ObjectId;
  quantity: number;
  type: string;
}
