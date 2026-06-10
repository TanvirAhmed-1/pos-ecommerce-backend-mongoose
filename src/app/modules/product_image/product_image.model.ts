import { Schema, model } from "mongoose";
import { IProductImage } from "./product_image.interface";

const productImageSchema = new Schema<IProductImage>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const ProductImageModel = model<IProductImage>("ProductImage", productImageSchema);
