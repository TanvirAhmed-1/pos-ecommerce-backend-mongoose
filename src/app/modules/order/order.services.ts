import mongoose from "mongoose";
import { CartModel } from "../cart/cart.model";
import { OrderModel } from "./order.model";
import { VariantModel } from "../variant/variant.model";

const createOrderIntoDB = async (userId: string, payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ১. ইউজারের কার্ট চেক করা
    const cart = await CartModel.findOne({ user: userId }).session(session);
    if (!cart || cart.items.length === 0) {
      throw new Error("Your cart is empty!");
    }

    // ২. স্টক ভ্যালিডেশন এবং স্টক কমানো
    for (const item of cart.items) {
      const variant = await VariantModel.findById(item.variant).session(
        session,
      );
      if (!variant || variant.stock < item.quantity) {
        throw new Error(`Product variant ${item.variant} is out of stock!`);
      }

      // স্টক আপডেট
      variant.stock -= item.quantity;
      await variant.save({ session });
    }

    // ৩. অর্ডার তৈরি করা
    const orderData = {
      user: userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      shippingAddress: payload.shippingAddress,
      payment: {
        method: payload.paymentMethod,
        status: payload.paymentMethod === "cod" ? "pending" : "paid", // যদি বিকাশ/নগদ অলরেডি সাকসেস হয়
        transactionId: payload.transactionId,
        date: new Date(),
      },
      deliveryType: payload.deliveryType,
    };

    const order = await OrderModel.create([orderData], { session });

    // ৪. অর্ডার সাকসেসফুল হলে কার্ট খালি করা
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

export const OrderService = {
  createOrderIntoDB,
};
