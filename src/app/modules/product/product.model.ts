import { Schema, model } from "mongoose";
import slugify from "slugify";
import { IProduct } from "./product.interface";
import "../variant/variant.model";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },

    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    description: { type: String },

    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    keywords: [{ type: String }],

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },

    thumbnail: { type: String, required: true },
    images: [{ type: String }],

    basePrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },

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

// --- Pre-save Hooks (Professional Syntax) ---
productSchema.pre("save", async function (this: IProduct) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (this.basePrice && this.salePrice && this.basePrice > this.salePrice) {
    this.discountPercentage = Math.round(
      ((this.basePrice - this.salePrice) / this.basePrice) * 100,
    );
  } else {
    this.discountPercentage = 0;
  }
});

// --- Search Index ---
productSchema.index({ name: "text", slug: 1, keywords: "text" });

export const ProductModel = model<IProduct>("Product", productSchema);
