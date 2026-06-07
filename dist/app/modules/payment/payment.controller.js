"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const config_1 = __importDefault(require("../../config"));
const payment_services_1 = require("./payment.services");
const bkashCallback = (0, catchAsync_1.default)(async (req, res) => {
    const { paymentID, status, userId } = req.query;
    console.log("bKash Callback Received:", { status, paymentID, userId });
    if (status !== "success") {
        console.log("Redirecting to fail page because status is:", status);
        return res.redirect(`${config_1.default.frontend_url}/payment/fail`);
    }
    try {
        const result = await payment_services_1.PaymentServices.executeBkashPayment(paymentID, userId);
        return res.redirect(`${config_1.default.frontend_url}/payment/success?trxID=${result.trxID}`);
    }
    catch (error) {
        return res.redirect(`${config_1.default.frontend_url}/payment/fail`);
    }
});
exports.PaymentControllers = { bkashCallback };
