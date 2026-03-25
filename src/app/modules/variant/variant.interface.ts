import { Types } from "mongoose";

export interface IVariantAttribute {
  attribute: Types.ObjectId;
  value: string;
}

export interface IVariant {
  product: Types.ObjectId;
  attributes: IVariantAttribute[];
  price: number;
  stock: number;
  sku: string;
  isActive: boolean;
}
