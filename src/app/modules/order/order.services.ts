import mongoose from "mongoose";
import { CartModel } from "../cart/cart.model";
import { OrderModel } from "./order.model";
import { VariantModel } from "../variant/variant.model";

const createOrderIntoDB = async (userId: string, payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await CartModel.findOne({ user: userId }).session(session);
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty!");
    }

    // অর্ডার ডাটা প্রস্তুত (পেমেন্ট স্ট্যাটাস সবসময় pending থাকবে শুরুতে)
    const orderData = {
      user: userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      shippingAddress: payload.shippingAddress,
      payment: {
        method: payload.paymentMethod,
        status: "pending",
        date: new Date(),
      },
      deliveryType: payload.deliveryType,
      orderStatus: "pending",
    };

    const order = await OrderModel.create([orderData], { session });

    // যদি COD হয়, তবে কার্ট খালি এবং স্টক এখনই কমিয়ে ফেলুন
    if (payload.paymentMethod === "cod") {
      for (const item of cart.items) {
        await VariantModel.findByIdAndUpdate(
          item.variant,
          { $inc: { stock: -item.quantity } },
          { session },
        );
      }
      // কার্ট খালি করা
      await CartModel.findOneAndUpdate(
        { user: userId },
        { items: [], totalAmount: 0, totalItems: 0 },
        { session },
      );
    }

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

const updateOrderStatusInDB = async (orderId: string, status: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderModel.findById(orderId).session(session);
    if (!order) {
      throw new Error("Order not found!");
    }

    // যদি অর্ডার অলরেডি ডেলিভারড হয়ে যায়, তবে আর ক্যানসেল করা যাবে না
    if (order.orderStatus === "delivered" && status === "cancelled") {
      throw new Error("Delivered order cannot be cancelled!");
    }

    // যদি অর্ডার ক্যানসেল করা হয়, তবে স্টক ফেরত দেওয়া (Restock)
    if (status === "cancelled" && order.orderStatus !== "cancelled") {
      for (const item of order.items) {
        await VariantModel.findByIdAndUpdate(
          item.variant,
          { $inc: { stock: item.quantity } },
          { session },
        );
      }
    }

    // স্ট্যাটাস আপডেট
    const result = await OrderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true, session },
    );

    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

const getAllOrdersFromDB = async () => {
  return await OrderModel.find()
    .populate("user", "name email phone")
    .populate("items.product", "name thumbnail slug")
    .populate("items.variant")
    .sort("-createdAt");
};

export const OrderService = {
  createOrderIntoDB,
  getMyOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderStatusInDB,
  getAllOrdersFromDB,
};
