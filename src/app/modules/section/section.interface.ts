import { Types } from "mongoose";

export type ISection = {
  title: string;
  slug: string;
  description?: string;
  products: Types.ObjectId[];
  isActive: boolean;
  displayOrder: number;
};