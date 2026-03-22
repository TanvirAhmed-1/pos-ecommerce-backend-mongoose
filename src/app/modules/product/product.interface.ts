import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  brand?: Types.ObjectId;
  thumbnail: string;
  images: string[];
  basePrice: number;
  salePrice: number;
  discountPercentage: number;
  vat: number;
  hasVariants: boolean;
  totalStock: number;
  averageRating: number;
  totalReviews: number;
  visibility: "published" | "hidden" | "out_of_stock";
  isActive: boolean;
  // Custom Properties for Logic
  _isWishlisted?: boolean;
  isWishlisted?: boolean;
}