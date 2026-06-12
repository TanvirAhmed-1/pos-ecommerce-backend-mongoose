import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  description?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
  };
  company?: Types.ObjectId;
  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  brand?: Types.ObjectId;
  thumbnail: string;
  images: string[];
  basePrice: number;
  salePrice: number;
  resellerPrice: number;
  discountType: "flat" | "percentage";
  productDiscount: number;
  vat: number;
  hasVariants: boolean;
  totalStock: number;
  averageRating: number;
  totalReviews: number;
  visibility: "published" | "hidden" | "out_of_stock";
  isActive: boolean;
  // New Design Fields
  sku?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  // Custom Properties for Logic
  _isWishlisted?: boolean;
  isWishlisted?: boolean;
}