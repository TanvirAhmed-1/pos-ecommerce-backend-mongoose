import mongoose from "mongoose";
import { CartModel } from "../cart/cart.model";
import { OrderModel } from "./order.model";
import { VariantModel } from "../variant/variant.model";

const createOrderIntoDB = async (userId: string, payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ১. কার্ট থেকে অর্ডারের জন্য প্রয়োজনীয় ডাটা নিয়ে আসা
    const cart = await CartModel.findOne({ user: userId }).session(session);
    if (!cart || cart.items.length === 0) {
      throw new Error(
        "Cart is empty! Please add items to cart before checkout.",
      );
    }

    // ২. প্রতিটি আইটেমের স্টক চেক এবং কমানো
    for (const item of cart.items) {
      const variant = await VariantModel.findById(item.variant).session(
        session,
      );

      if (!variant) throw new Error("Product variant not found!");
      if (variant.stock < item.quantity) {
        throw new Error(
          `Product variant out of stock! Available: ${variant.stock}`,
        );
      }

      // স্টক আপডেট
      variant.stock -= item.quantity;
      await variant.save({ session });
    }

    // ৩. অর্ডারের ডাটা প্রস্তুত করা
    const orderData = {
      user: userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      shippingAddress: payload.shippingAddress,
      payment: {
        method: payload.paymentMethod,
        status: payload.paymentMethod === "cod" ? "pending" : "paid",
        transactionId: payload.transactionId || null,
        date: new Date(),
      },
      deliveryType: payload.deliveryType,
    };

    const order = await OrderModel.create([orderData], { session });

    // ৪. অর্ডার সাকসেসফুল হলে কার্ট একদম খালি করে দেওয়া
    await CartModel.findOneAndUpdate(
      { user: userId },
      { items: [], totalAmount: 0, totalItems: 0 },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return order[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

const getMyOrdersFromDB = async (userId: string) => {
  return await OrderModel.find({ user: userId })
    .populate("items.product", "name thumbnail slug")
    .sort("-createdAt"); // নতুন অর্ডার আগে দেখাবে
};

const getSingleOrderFromDB = async (orderId: string, userId: string) => {
  return await OrderModel.findOne({ _id: orderId, user: userId })
    .populate("items.product")
    .populate("items.variant");
};

export const OrderService = {
  createOrderIntoDB,
  getMyOrdersFromDB,
  getSingleOrderFromDB,
};
