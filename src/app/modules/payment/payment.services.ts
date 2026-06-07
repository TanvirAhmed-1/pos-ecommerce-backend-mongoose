import axios from "axios";
import config from "../../config";
import { OrderModel } from "../order/order.model";
import { CartModel } from "../cart/cart.model";
import { PaymentModel } from "./payment.model";
import { VariantModel } from "../variant/variant.model";

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
      OrderModel.findByIdAndUpdate(orderId, { "payment.status": "paid", orderStatus: "processing" })
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

export const PaymentServices = { initBkashPayment, executeBkashPayment };