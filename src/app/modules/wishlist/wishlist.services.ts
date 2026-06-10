import { WishlistModel } from "./wishlist.model";
import { ProductModel } from "../product/product.model";

const addProductToWishlistDB = async (userId: string, productId: string) => {
  const isProductExist = await ProductModel.findById(productId);
  if (!isProductExist) {
    throw new Error("Product not found!");
  }

  let wishlist = await WishlistModel.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await WishlistModel.create({
      user: userId,
      products: [productId],
    });
  } else {
    const isExist = wishlist.products.find((id) => id.toString() === productId);

    if (isExist) {
      throw new Error("this product already in wishlist!");
    }

    wishlist.products.push(productId as any);
    await wishlist.save();
  }

  return wishlist;
};

// ২. উইশলিস্ট থেকে প্রোডাক্ট সরিয়ে ফেলা
const removeProductFromWishlistDB = async (
  userId: string,
  productId: string,
) => {
  const wishlist = await WishlistModel.findOne({ user: userId });

  if (!wishlist) {
    throw new Error("Wishlist not found!");
  }

  // প্রোডাক্টটি ফিল্টার করে বাদ দেওয়া
  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId,
  );

  await wishlist.save();
  return wishlist;
};

// ৩. উইশলিস্ট ফেচ করা
const getMyWishlistFromDB = async (userId: string) => {
  return await WishlistModel.findOne({ user: userId }).populate({
    path: "products",
    select: "name thumbnail slug basePrice salePrice stock",
  });
};

export const WishlistService = {
  addProductToWishlistDB,
  removeProductFromWishlistDB,
  getMyWishlistFromDB,
};
