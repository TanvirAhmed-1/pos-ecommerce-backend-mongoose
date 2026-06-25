import axios from "axios";
import config from "../../config";
import { OrderModel } from "../order/order.model";
import { CartModel } from "../cart/cart.model";
import { PaymentModel } from "./payment.model";
import { VariantModel } from "../variant/variant.model";
import { InvoiceService } from "../invoice/invoice.services";
import { UserModel } from "../user/user.model";

const getBkashHeaders = async () => {
  try {
    const { data } = await axios.post(
      config.bkash_grant_token_url,
      {
        app_key: config.bkash_app_key,
        app_secret: config.bkash_app_secret,
      },
      {
        headers: {
          username: config.bkash_username, 
          password: config.bkash_password,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return {
      "content-type": "application/json",
      "accept": "application/json",
      "authorization": data.id_token, 
      "x-app-key": config.bkash_app_key, 
    };
  } catch (error: any) {
    console.error(" bKash Token Generation Failed:", error.response?.data || error.message);
    throw new Error("bKash Authentication Failed (401)");
  }
};

const initBkashPayment = async (orderId: string, userId: string, amount: number) => {
  const headers = await getBkashHeaders();
  const { data } = await axios.post(
    config.bkash_create_payment_url!,
    {
      mode: "0011",
      payerReference: userId.toString(),
      callbackURL: `${config.backend_url}/api/payment/bkash-callback`,
      amount: amount.toFixed(2),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: orderId,
    },
    { headers }
  );

  if (data.statusCode !== "0000") throw new Error(data.statusMessage);

  await PaymentModel.create({
    transactionId: `${orderId}_${Date.now()}`,
    order: orderId,
    user: userId,
    amount,
  });

  return data.bkashURL;
};

const executeBkashPayment = async (paymentID: string, userId: string) => {
  const headers = await getBkashHeaders();
  const { data: executeData } = await axios.post(
    config.bkash_execute_payment_url!,
    { paymentID },
    { headers }
  );

  if (executeData.statusCode === "0000") {
    const orderId = executeData.merchantInvoiceNumber;

    await Promise.all([
      PaymentModel.findOneAndUpdate({ order: orderId }, { status: "SUCCESS", gatewayTrxId: executeData.trxID }),
      OrderModel.findByIdAndUpdate(orderId, { "payment.status": "paid", orderStatus: "processing" }),
      InvoiceService.updateInvoicePaymentStatus(orderId, "paid")
    ]);

    const order = await OrderModel.findById(orderId);
    if (order) {
      for (const item of order.items) {
        await VariantModel.findByIdAndUpdate(item.variant, { $inc: { stock: -item.quantity } });
      }
    }

    await CartModel.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0 });

    return { trxID: executeData.trxID };
  }
  throw new Error(executeData.statusMessage);
};

const getAllPaymentsFromDB = async (query: Record<string, any>) => {
  const { page = 1, limit = 20, searchTerm, status, gateway } = query;

  let filter: any = {};

  if (status && status !== "All") {
    filter.status = status.toUpperCase();
  }

  if (gateway && gateway !== "All") {
    filter.paymentGateway = gateway.toUpperCase();
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
      { transactionId: { $regex: searchTerm, $options: "i" } },
      { gatewayTrxId: { $regex: searchTerm, $options: "i" } },
      { user: { $in: userIds } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const paymentQuery = PaymentModel.find(filter)
    .populate("user", "name email phone")
    .populate({
      path: "order",
      select: "orderStatus totalAmount payment deliveryType createdAt",
    })
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit));

  const result = await paymentQuery;
  const total = await PaymentModel.countDocuments(filter);

  // Statistics
  const allStats = await PaymentModel.aggregate([
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        successfulPayments: {
          $sum: { $cond: [{ $eq: ["$status", "SUCCESS"] }, 1, 0] }
        },
        pendingPayments: {
          $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] }
        },
        totalAmountCollected: {
          $sum: {
            $cond: [
              { $eq: ["$status", "SUCCESS"] },
              "$amount",
              0
            ]
          }
        }
      }
    }
  ]);

  const stats = allStats[0] || {
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    totalAmountCollected: 0
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

const getSinglePaymentFromDB = async (paymentId: string) => {
  return await PaymentModel.findById(paymentId)
    .populate("user", "name email phone")
    .populate({
      path: "order",
      populate: [
        { path: "items.product", select: "name thumbnail" },
        { path: "items.variant", select: "name color size price" }
      ]
    });
};

const updatePaymentStatusInDB = async (paymentId: string, payload: Partial<any>) => {
  const result = await PaymentModel.findByIdAndUpdate(
    paymentId,
    payload,
    { new: true }
  ).populate("user", "name email phone");
  
  if (!result) {
    throw new Error("Payment record not found!");
  }
  return result;
};

const deletePaymentFromDB = async (paymentId: string) => {
  const result = await PaymentModel.findByIdAndDelete(paymentId);
  if (!result) {
    throw new Error("Payment record not found!");
  }
  return result;
};

export const PaymentServices = { 
  initBkashPayment, 
  executeBkashPayment, 
  getAllPaymentsFromDB, 
  getSinglePaymentFromDB, 
  updatePaymentStatusInDB, 
  deletePaymentFromDB 
};