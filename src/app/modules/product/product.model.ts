import { Schema, model } from "mongoose";
import slugify from "slugify";
import { IProduct } from "./product.interface";
import "../variant/variant.model";

const seoSchema = new Schema(
  {
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    metaKeywords: [{ type: String }],
    ogTitle: { type: String },
    ogDescription: { type: String },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    shortDescription: { type: String, required: true },
    description: { type: String },
    keyFeatures: [{ type: String, trim: true }],
    specifications: [
      {
        key: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
    warranty: { type: String, trim: true },
    warrantyPolicy: { type: String },
    seo: { type: seoSchema },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: "Category" },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    thumbnail: { type: String, required: true },
    images: [{ type: String }],
    basePrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, required: true, min: 0 },
    resellerPrice: { type: Number, required: true, default: 0, min: 0 },
    purchasePrice: { type: Number, min: 0, default: 0 },
    wholesalePrice: { type: Number, min: 0, default: 0 },
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      default: "flat",
    },
    productDiscount: { type: Number, default: 0, min: 0 },
    vat: { type: Number, default: 0 },
    vatType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage",
    },

    hasVariants: { type: Boolean, default: false },
    totalStock: { type: Number, default: 0 },

    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    visibility: {
      type: String,
      enum: ["published", "hidden", "out_of_stock"],
      default: "published",
    },
    isActive: { type: Boolean, default: true },
    
    // Base Info Fields
    productCode: { type: String, trim: true },
    materials: { type: String, trim: true },
    unitMeasure: { type: String, trim: true, default: "pcs" },
    gender: { type: String, default: "all" },
    barcode: { type: String, trim: true },
    weight: { type: Number, min: 0, default: 0 },

    // New Design Fields
    sku: { type: String },
    isRecommended: { type: Boolean, default: false },
    isCategoryProduct: { type: Boolean, default: false },
    isTopSelling: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.virtual("productVariants", {
  ref: "Variant", 
  localField: "_id",
  foreignField: "product",
});

// --- Wishlist Status Virtual (Fix) ---
productSchema
  .virtual("isWishlisted")
  .get(function (this: IProduct) {
    return this._isWishlisted || false;
  })
  .set(function (this: IProduct, value: boolean) {
    this._isWishlisted = value;
  });

productSchema.virtual("socialMedia").get(function (this: any) {
  return this.company?.socialMedia || [];
});

// --- Pre-save Hooks (Professional Syntax) ---
productSchema.pre("save", async function (this: IProduct) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

// --- Search Index ---
productSchema.index({ name: "text", slug: 1, "seo.metaKeywords": "text" });

export const ProductModel = model<IProduct>("Product", productSchema);
