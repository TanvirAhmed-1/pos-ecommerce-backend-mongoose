"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const order_services_1 = require("./order.services");
const order_model_1 = require("./order.model");
const payment_services_1 = require("../payment/payment.services");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createOrder = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const { paymentMethod } = req.body;
    const order = await order_services_1.OrderService.createOrderIntoDB(userId, req.body);
    // ২. যদি পেমেন্ট মেথড বিকাশ (bKash) হয়
    if (paymentMethod === "bkash") {
        try {
            // পেমেন্ট ইননিশিয়েট করা (অ্যামাউন্টসহ পাস করুন)
            const bkashURL = await payment_services_1.PaymentServices.initBkashPayment(order._id.toString(), userId, order.totalAmount);
            return res.status(http_status_1.default.OK).json({
                success: true,
                message: "Order created successfully. Redirecting to bKash...",
                data: bkashURL, // ফ্রন্টএন্ডে এটি 'paymentURL' হিসেবে রিসিভ হবে
            });
        }
        catch (error) {
            // যদি বিকাশ গেটওয়েতে কোনো সমস্যা হয়, তবে অর্ডার স্ট্যাটাস আপডেট করুন
            await order_model_1.OrderModel.findByIdAndUpdate(order._id, {
                "payment.status": "failed",
                orderStatus: "cancelled", // পেমেন্ট শুরুই না হলে অর্ডারটি ক্যানসেলড ধরা নিরাপদ
            });
            // সিনিয়ররা সাধারণত আসল এররটি লগে রাখে কিন্তু ইউজারকে ক্লিন মেসেজ দেয়
            console.error("bKash Error:", error.message);
            throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, "Unable to initiate bKash payment. Please try again later.");
        }
    }
    // ৩. যদি Cash on Delivery (COD) হয়
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Order placed successfully with Cash on Delivery",
        data: order,
    });
});
const getMyOrders = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const result = await order_services_1.OrderService.getMyOrdersFromDB(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Order fetched successfully",
        data: result,
    });
});
const getSingleOrder = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await order_services_1.OrderService.getSingleOrderFromDB(id, userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: result,
    });
});
const updateOrderStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await order_services_1.OrderService.updateOrderStatusInDB(id, status);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: `Order status updated to ${status}`,
        data: result,
    });
});
const getAllOrders = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await order_services_1.OrderService.getAllOrdersFromDB();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "All orders retrieved successfully",
        data: result,
    });
});
exports.OrderController = {
    createOrder,
    getMyOrders,
    getSingleOrder,
    updateOrderStatus,
    getAllOrders,
};
