import { Document, Types } from "mongoose";

export interface IWishlistItem extends Document {
  wishlist: Types.ObjectId;
  product: Types.ObjectId;
}
