import axios from 'axios';
import { OrderModel } from '../order/order.model';
import { getBkashHeaders } from './payment.utils';
import { PaymentModel } from './payment.model';
import config from '../../config';

const initBkashPayment = async (orderId: string, userId: string) => {
  const order = await OrderModel.findById(orderId);
  if (!order) throw new Error("Order not found!");

  const headers = await getBkashHeaders();
  const { data } = await axios.post(
    config.bkash_create_payment_url!,
    {
      mode: '0011',
      payerReference: userId,
      callbackURL: `${config.backend_url}/api/v1/payment/bkash-callback`,
      amount: order.totalAmount.toFixed(2),
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: orderId,
    },
    { headers }
  );

  if (!data.bkashURL) throw new Error(data.statusMessage || "bKash failed");

  // ডাটাবেসে পেমেন্ট রেকর্ড তৈরি (Pending অবস্থায়)
  await PaymentModel.create({
    transactionId: orderId, // আমরা অর্ডার আইডিকেই ট্র্যাক আইডি বানাচ্ছি
    order: orderId,
    user: userId,
    amount: order.totalAmount,
    currency: 'BDT',
    paymentGateway: 'BKASH',
    status: 'PENDING'
  });

  return data.bkashURL;
};

const executeBkashPayment = async (paymentID: string) => {
  const headers = await getBkashHeaders();
  const { data: executeData } = await axios.post(
    config.bkash_execute_payment_url!,
    { paymentID },
    { headers }
  );

  if (executeData.statusCode === '0000') {
    // ১. পেমেন্ট স্ট্যাটাস আপডেট
    await PaymentModel.findOneAndUpdate(
      { transactionId: executeData.merchantInvoiceNumber },
      { 
        status: 'SUCCESS', 
        gatewayTrxId: executeData.trxID,
        paymentData: executeData 
      }
    );

    // ২. অর্ডার স্ট্যাটাস আপডেট
    await OrderModel.findByIdAndUpdate(executeData.merchantInvoiceNumber, {
      'payment.status': 'paid',
      'payment.transactionId': executeData.trxID,
      'orderStatus': 'processing'
    });

    return { success: true, trxID: executeData.trxID };
  }
  
  throw new Error(executeData.statusMessage || "Payment execution failed");
};

export const PaymentServices = { initBkashPayment, executeBkashPayment };