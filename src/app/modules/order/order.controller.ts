import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { OrderService } from "./order.services";
import { OrderModel } from "./order.model";
import { PaymentServices } from "../payment/payment.services";
import AppError from "../../errors/AppError";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { paymentMethod } = req.body;


  const order = await OrderService.createOrderIntoDB(userId, req.body);

  // ২. যদি পেমেন্ট মেথড বিকাশ (bKash) হয়
  if (paymentMethod === "bkash") {
    try {
      // পেমেন্ট ইননিশিয়েট করা (অ্যামাউন্টসহ পাস করুন)
      const bkashURL = await PaymentServices.initBkashPayment(
        order._id.toString(),
        userId,
        order.totalAmount, // সরাসরি অর্ডার অবজেক্ট থেকে অ্যামাউন্ট পাঠানো ভালো
      );

      return res.status(httpStatus.OK).json({
        success: true,
        message: "Order created successfully. Redirecting to bKash...",
        data: bkashURL, // ফ্রন্টএন্ডে এটি 'paymentURL' হিসেবে রিসিভ হবে
      });
    } catch (error: any) {
      // যদি বিকাশ গেটওয়েতে কোনো সমস্যা হয়, তবে অর্ডার স্ট্যাটাস আপডেট করুন
      await OrderModel.findByIdAndUpdate(order._id, {
        "payment.status": "failed",
        orderStatus: "cancelled", // পেমেন্ট শুরুই না হলে অর্ডারটি ক্যানসেলড ধরা নিরাপদ
      });

      // সিনিয়ররা সাধারণত আসল এররটি লগে রাখে কিন্তু ইউজারকে ক্লিন মেসেজ দেয়
      console.error("bKash Error:", error.message);
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "Unable to initiate bKash payment. Please try again later.",
      );
    }
  }

  // ৩. যদি Cash on Delivery (COD) হয়
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Order placed successfully with Cash on Delivery",
    data: order,
  });
});
const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await OrderService.getMyOrdersFromDB(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;
  const result = await OrderService.getSingleOrderFromDB(id as string, userId);

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  const result = await OrderService.updateOrderStatusInDB(id as string, status, paymentStatus);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Order updated successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrdersFromDB(req.query);

  res.status(httpStatus.OK).json({
    success: true,
    message: "All orders retrieved successfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OrderService.deleteOrderFromDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Order deleted successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
  getAllOrders,
  deleteOrder,
};
