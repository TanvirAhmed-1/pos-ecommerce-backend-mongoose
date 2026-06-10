import { Schema, model } from "mongoose";
import { IWishlistItem } from "./wishlist_item.interface";

const wishlistSchema = new Schema<IWishlistItem>(
  {
    wishlist: { type: Schema.Types.ObjectId, ref: "Wishlist", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

export const WishlistItemModel = model<IWishlistItem>("WishlistItem", wishlistSchema);
