"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const cart_model_1 = require("./cart.model");
const variant_model_1 = require("../variant/variant.model");
const addToCartIntoDB = async (userId, payload) => {
    const { product, variant, quantity } = payload;
    const variantData = await variant_model_1.VariantModel.findById(variant);
    if (!variantData)
        throw new Error("Variant not found!");
    if (variantData.stock < quantity)
        throw new Error("Insufficient stock!");
    // ব্যাকএন্ড থেকে প্রাইস নির্ধারণ
    const price = variantData.salePrice ||
        variantData.basePrice ||
        variantData.price;
    if (!price)
        throw new Error("Product price is not defined in the variant!");
    const itemTotalPrice = price * quantity;
    let cart = await cart_model_1.CartModel.findOne({ user: userId });
    if (!cart) {
        cart = await cart_model_1.CartModel.create({
            user: userId,
            items: [
                {
                    product: product,
                    variant: variant,
                    quantity,
                    price,
                    totalPrice: itemTotalPrice,
                },
            ],
        });
    }
    else {
        const existingItem = cart.items.find((item) => item.variant.toString() === variant);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice = existingItem.quantity * price;
        }
        else {
            cart.items.push({
                product: product,
                variant: variant,
                quantity,
                price,
                totalPrice: itemTotalPrice,
            });
        }
        await cart.save(); // pre-save hook will update totalAmount & totalItems
    }
    return cart;
};
const getMyCartFromDB = async (userId) => {
    return await cart_model_1.CartModel.findOne({ user: userId })
        .populate("items.product", "name thumbnail slug")
        .populate("items.variant", "name size color price stock");
};
const removeItemFromCartDB = async (userId, variantId) => {
    const cart = await cart_model_1.CartModel.findOne({ user: userId });
    if (!cart)
        throw new Error("Cart not found!");
    cart.items = cart.items.filter((item) => item.variant.toString() !== variantId);
    await cart.save();
    return cart;
};
const updateQuantityInCartDB = async (userId, variantId, action) => {
    const cart = await cart_model_1.CartModel.findOne({ user: userId });
    if (!cart)
        throw new Error("Cart not found!");
    const item = cart.items.find((i) => i.variant.toString() === variantId);
    if (!item)
        throw new Error("Item not found in cart!");
    if (action === "increment") {
        // স্টক চেক করা হচ্ছে
        const variantData = await variant_model_1.VariantModel.findById(variantId);
        if (!variantData || variantData.stock <= item.quantity) {
            throw new Error("Out of stock!");
        }
        item.quantity += 1;
    }
    else {
        // action === "decrement"
        if (item.quantity > 1) {
            item.quantity -= 1;
        }
        else {
            // পরিমাণ ১ এর কম হলে আইটেমটি রিমুভ করে দেওয়া ভালো
            return await removeItemFromCartDB(userId, variantId);
        }
    }
    // প্রাইস রি-ক্যালকুলেট
    item.totalPrice = item.quantity * item.price;
    await cart.save();
    return cart;
};
const clearCartFromDB = async (userId) => {
    return await cart_model_1.CartModel.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0, totalItems: 0 }, { new: true });
};
exports.CartService = {
    addToCartIntoDB,
    getMyCartFromDB,
    removeItemFromCartDB,
    updateQuantityInCartDB,
    clearCartFromDB,
};
