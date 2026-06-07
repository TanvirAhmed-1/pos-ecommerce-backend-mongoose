"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const wishlist_model_1 = require("./wishlist.model");
const addProductToWishlistDB = async (userId, productId) => {
    let wishlist = await wishlist_model_1.WishlistModel.findOne({ user: userId });
    if (!wishlist) {
        wishlist = await wishlist_model_1.WishlistModel.create({
            user: userId,
            products: [productId],
        });
    }
    else {
        const isExist = wishlist.products.find((id) => id.toString() === productId);
        if (isExist) {
            throw new Error("this product already in wishlist!");
        }
        wishlist.products.push(productId);
        await wishlist.save();
    }
    return wishlist;
};
// ২. উইশলিস্ট থেকে প্রোডাক্ট সরিয়ে ফেলা
const removeProductFromWishlistDB = async (userId, productId) => {
    const wishlist = await wishlist_model_1.WishlistModel.findOne({ user: userId });
    if (!wishlist) {
        throw new Error("Wishlist not found!");
    }
    // প্রোডাক্টটি ফিল্টার করে বাদ দেওয়া
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();
    return wishlist;
};
// ৩. উইশলিস্ট ফেচ করা
const getMyWishlistFromDB = async (userId) => {
    return await wishlist_model_1.WishlistModel.findOne({ user: userId }).populate({
        path: "products",
        select: "name thumbnail slug basePrice salePrice stock",
    });
};
exports.WishlistService = {
    addProductToWishlistDB,
    removeProductFromWishlistDB,
    getMyWishlistFromDB,
};
