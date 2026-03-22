import { Types } from "mongoose";

export interface IVariant {
  product: Types.ObjectId;
  attributeName: string;
  attributeValue: string;
  price: number;
  stock: number;
  sku: string;
  isActive: boolean;
}
