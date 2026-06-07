"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
const order_model_1 = require("../order/order.model");
const cart_model_1 = require("../cart/cart.model");
const payment_model_1 = require("./payment.model");
const variant_model_1 = require("../variant/variant.model");
const getBkashHeaders = async () => {
    try {
        const { data } = await axios_1.default.post(config_1.default.bkash_grant_token_url, {
            app_key: config_1.default.bkash_app_key,
            app_secret: config_1.default.bkash_app_secret,
        }, {
            headers: {
                username: config_1.default.bkash_username,
                password: config_1.default.bkash_password,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });
        return {
            "content-type": "application/json",
            "accept": "application/json",
            "authorization": data.id_token,
            "x-app-key": config_1.default.bkash_app_key,
        };
    }
    catch (error) {
        console.error(" bKash Token Generation Failed:", error.response?.data || error.message);
        throw new Error("bKash Authentication Failed (401)");
    }
};
const initBkashPayment = async (orderId, userId, amount) => {
    const headers = await getBkashHeaders();
    const { data } = await axios_1.default.post(config_1.default.bkash_create_payment_url, {
        mode: "0011",
        payerReference: userId.toString(),
        callbackURL: `${config_1.default.backend_url}/api/payment/bkash-callback`,
        amount: amount.toFixed(2),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: orderId,
    }, { headers });
    if (data.statusCode !== "0000")
        throw new Error(data.statusMessage);
    await payment_model_1.PaymentModel.create({
        transactionId: `${orderId}_${Date.now()}`,
        order: orderId,
        user: userId,
        amount,
    });
    return data.bkashURL;
};
const executeBkashPayment = async (paymentID, userId) => {
    const headers = await getBkashHeaders();
    const { data: executeData } = await axios_1.default.post(config_1.default.bkash_execute_payment_url, { paymentID }, { headers });
    if (executeData.statusCode === "0000") {
        const orderId = executeData.merchantInvoiceNumber;
        await Promise.all([
            payment_model_1.PaymentModel.findOneAndUpdate({ order: orderId }, { status: "SUCCESS", gatewayTrxId: executeData.trxID }),
            order_model_1.OrderModel.findByIdAndUpdate(orderId, { "payment.status": "paid", orderStatus: "processing" })
        ]);
        const order = await order_model_1.OrderModel.findById(orderId);
        if (order) {
            for (const item of order.items) {
                await variant_model_1.VariantModel.findByIdAndUpdate(item.variant, { $inc: { stock: -item.quantity } });
            }
        }
        await cart_model_1.CartModel.findOneAndUpdate({ user: userId }, { items: [], totalAmount: 0 });
        return { trxID: executeData.trxID };
    }
    throw new Error(executeData.statusMessage);
};
exports.PaymentServices = { initBkashPayment, executeBkashPayment };
