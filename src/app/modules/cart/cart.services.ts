import { CartModel } from "./cart.model";
import { VariantModel } from "../variant/variant.model";

const addToCartIntoDB = async (
  userId: string,
  payload: { product: string; variant: string; quantity: number },
) => {
  const { product, variant, quantity } = payload;

  const variantData = await VariantModel.findById(variant);
  if (!variantData) throw new Error("Variant not found!");
  if (variantData.stock < quantity) throw new Error("Insufficient stock!");

  // ব্যাকএন্ড থেকে প্রাইস নির্ধারণ
  const price =
    (variantData as any).salePrice ||
    (variantData as any).basePrice ||
    (variantData as any).price;

  if (!price) throw new Error("Product price is not defined in the variant!");

  const itemTotalPrice = price * quantity;

  let cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    cart = await CartModel.create({
      user: userId,
      items: [
        {
          product: product as any,
          variant: variant as any,
          quantity,
          price,
          totalPrice: itemTotalPrice,
        },
      ],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.variant.toString() === variant,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * price;
    } else {
      cart.items.push({
        product: product as any,
        variant: variant as any,
        quantity,
        price,
        totalPrice: itemTotalPrice,
      });
    }
    await cart.save(); // pre-save hook will update totalAmount & totalItems
  }

  return cart;
};


const getMyCartFromDB = async (userId: string) => {
  return await CartModel.findOne({ user: userId })
    .populate("items.product", "name thumbnail slug")
    .populate("items.variant", "name size color price stock");
};

const removeItemFromCartDB = async (userId: string, variantId: string) => {
  const cart = await CartModel.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found!");

  cart.items = cart.items.filter((item) => item.variant.toString() !== variantId);
  
  await cart.save();
  return cart;
};

const updateQuantityInCartDB = async (
  userId: string,
  variantId: string,
  action: "increment" | "decrement"
) => {
  const cart = await CartModel.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found!");

  const item = cart.items.find((i) => i.variant.toString() === variantId);
  if (!item) throw new Error("Item not found in cart!");

  if (action === "increment") {
    // স্টক চেক করা হচ্ছে
    const variantData = await VariantModel.findById(variantId);
    if (!variantData || variantData.stock <= item.quantity) {
      throw new Error("Out of stock!");
    }
    item.quantity += 1;
  } else {
    // action === "decrement"
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // পরিমাণ ১ এর কম হলে আইটেমটি রিমুভ করে দেওয়া ভালো
      return await removeItemFromCartDB(userId, variantId);
    }
  }

  // প্রাইস রি-ক্যালকুলেট
  item.totalPrice = item.quantity * item.price;

  await cart.save();
  return cart;
};


const clearCartFromDB = async (userId: string) => {
  return await CartModel.findOneAndUpdate(
    { user: userId },
    { items: [], totalAmount: 0, totalItems: 0 },
    { new: true },
  );
};

export const CartService = {
  addToCartIntoDB,
  getMyCartFromDB,
  removeItemFromCartDB,
  updateQuantityInCartDB,
  clearCartFromDB,
};