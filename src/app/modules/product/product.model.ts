import { Schema, model } from "mongoose";
import { number } from "zod";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    //description
    shortDescription: { type: String },
    fullDescription: { type: String }, // HTML
    description: { type: String },
    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: {},
    thumbnail: { type: String, required: true },
    images: [{ type: String }],
    //Price
    basePrice: { type: Number, required: true },
    sealPrice: { type: Number, required: true },
    hasVariants: { type: Boolean, default: false },
    vat: { type: number, default: 0 },

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

// --- Virtual for Variants ---
productSchema.virtual("productVariants", {
  ref: "Variant",
  localField: "_id",
  foreignField: "product",
});

export const ProductModel = model("Product", productSchema);
