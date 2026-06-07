"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    gatewayTrxId: {
        type: String
    },
    order: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "BDT"
    },
    paymentGateway: {
        type: String,
        enum: ["BKASH", "NAGAD", "SSL"],
        default: "BKASH"
    },
    status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED", "CANCELLED"],
        default: "PENDING",
    },
    paymentData: {
        type: Object
    },
}, {
    timestamps: true
});
exports.PaymentModel = (0, mongoose_1.model)("Payment", paymentSchema);
