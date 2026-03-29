import axios from "axios";
import config from "../../config";
import { OrderModel } from "../order/order.model";
import { CartModel } from "../cart/cart.model";
import { PaymentModel } from "./payment.model";
import { VariantModel } from "../variant/variant.model";

// ১. প্রাইভেট হেডার ফাংশন
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
          username: config.bkash_username, // 'sandboxTokenizedUser'
          password: config.bkash_password, // 'sandboxTokenizedPassword02'
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ সিনিয়র টিপস: স্যান্ডবক্সে 'Bearer ' ছাড়া শুধু টোকেন পাঠানোই সবচেয়ে সেফ
    return {
      "content-type": "application/json",
      "accept": "application/json",
      "authorization": data.id_token, 
      "x-app-key": config.bkash_app_key, 
    };
  } catch (error: any) {
    // এখানে এররটি প্রিন্ট করলে আপনি আসল কারণ দেখতে পাবেন (যেমন: Username/Password wrong)
    console.error("❌ bKash Token Generation Failed:", error.response?.data || error.message);
    throw new Error("bKash Authentication Failed (401)");
  }
};

// ২. পেমেন্ট শুরু করা
const initBkashPayment = async (orderId: string, userId: string, amount: number) => {
  const headers = await getBkashHeaders();
  const { data } = await axios.post(
    config.bkash_create_payment_url!,
    {
      mode: "0011",
      payerReference: userId.toString(),
      callbackURL: `${config.backend_url}/api/v1/payment/bkash-callback`,
      amount: amount.toFixed(2),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: orderId,
    },
    { headers }
  );

  if (data.statusCode !== "0000") throw new Error(data.statusMessage);

  // পেমেন্ট হিস্ট্রি সেভ (Audit Trail এর জন্য জরুরি)
  await PaymentModel.create({
    transactionId: `${orderId}_${Date.now()}`,
    order: orderId,
    user: userId,
    amount,
  });

  return data.bkashURL;
};

// ৩. পেমেন্ট কনফার্ম করা ও স্টক কমানো
const executeBkashPayment = async (paymentID: string, userId: string) => {
  const headers = await getBkashHeaders();
  const { data: executeData } = await axios.post(
    config.bkash_execute_payment_url!,
    { paymentID },
    { headers }
  );

  if (executeData.statusCode === "0000") {
    const orderId = executeData.merchantInvoiceNumber;

    // পেমেন্ট ও অর্ডার আপডেট
    await Promise.all([
      PaymentModel.findOneAndUpdate({ order: orderId }, { status: "SUCCESS", gatewayTrxId: executeData.trxID }),
      OrderModel.findByIdAndUpdate(orderId, { "payment.status": "paid", orderStatus: "processing" })
    ]);

    // ইনভেন্টরি (স্টক) আপডেট
    const order = await OrderModel.findById(orderId);
    if (order) {
      for (const item of order.items) {
        await VariantModel.findByIdAndUpdate(item.variant, { $inc: { stock: -item.quantity } });
      }
    }

    // কার্ট খালি করা
    await CartModel.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0 });

    return { trxID: executeData.trxID };
  }
  throw new Error(executeData.statusMessage);
};

export const PaymentServices = { initBkashPayment, executeBkashPayment };