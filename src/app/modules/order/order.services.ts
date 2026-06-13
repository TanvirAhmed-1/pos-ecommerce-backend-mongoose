import mongoose from "mongoose";
import { CartModel } from "../cart/cart.model";
import { OrderModel } from "./order.model";
import { VariantModel } from "../variant/variant.model";
import { InvoiceService } from "../invoice/invoice.services";
import { UserModel } from "../user/user.model";

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

    // Generate Invoice automatically for the order
    await InvoiceService.createInvoiceFromOrder(order[0]._id.toString(), session);

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

const updateOrderStatusInDB = async (orderId: string, status?: string, paymentStatus?: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderModel.findById(orderId).session(session);
    if (!order) {
      throw new Error("Order not found!");
    }

    // যদি অর্ডার অলরেডি ডেলিভারড হয়ে যায়, তবে আর ক্যানসেল করা যাবে না
    if (status === "cancelled" && order.orderStatus === "delivered") {
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

    const updateData: any = {};
    if (status) {
      updateData.orderStatus = status;
    }
    if (paymentStatus) {
      updateData["payment.status"] = paymentStatus;
    }

    // স্ট্যাটাস আপডেট
    const result = await OrderModel.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, session },
    );

    if (status === "cancelled" || paymentStatus === "cancelled") {
      await InvoiceService.updateInvoicePaymentStatus(orderId, "cancelled");
    } else if (paymentStatus === "paid") {
      await InvoiceService.updateInvoicePaymentStatus(orderId, "paid");
    }

    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

const getAllOrdersFromDB = async (query: Record<string, any>) => {
  const { page = 1, limit = 20, searchTerm, status } = query;

  let filter: any = {};

  if (status && status !== "All") {
    filter.orderStatus = status.toLowerCase();
  }

  if (searchTerm) {
    const matchingUsers = await UserModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ],
    }).select("_id");

    const userIds = matchingUsers.map((u) => u._id);

    filter.$or = [
      { user: { $in: userIds } },
      { "shippingAddress.fullName": { $regex: searchTerm, $options: "i" } },
      { "shippingAddress.phone": { $regex: searchTerm, $options: "i" } },
      { "shippingAddress.address": { $regex: searchTerm, $options: "i" } },
      { "shippingAddress.city": { $regex: searchTerm, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const orderQuery = OrderModel.find(filter)
    .populate("user", "name email phone")
    .populate("items.product", "name thumbnail slug")
    .populate("items.variant")
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit));

  const result = await orderQuery;
  const total = await OrderModel.countDocuments(filter);

  // Global order statistics aggregation
  const allStats = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] }
        },
        processingOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "processing"] }, 1, 0] }
        },
        totalSales: {
          $sum: {
            $cond: [
              { $or: [
                { $eq: ["$orderStatus", "delivered"] },
                { $eq: ["$payment.status", "paid"] }
              ]},
              "$totalAmount",
              0
            ]
          }
        }
      }
    }
  ]);

  const stats = allStats[0] || {
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    totalSales: 0
  };

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
      stats
    },
    data: result,
  };
};

const deleteOrderFromDB = async (orderId: string) => {
  const result = await OrderModel.findByIdAndDelete(orderId);
  if (!result) {
    throw new Error("Order not found!");
  }
  return result;
};

export const OrderService = {
  createOrderIntoDB,
  getMyOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderStatusInDB,
  getAllOrdersFromDB,
  deleteOrderFromDB,
};
