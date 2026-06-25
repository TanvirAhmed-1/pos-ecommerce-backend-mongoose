import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import config from "../../config";
import { PaymentServices } from "./payment.services";


const bkashCallback = catchAsync(async (req: Request, res: Response) => {
  const { paymentID, status, userId } = req.query;

  console.log("bKash Callback Received:", { status, paymentID, userId });

  if (status !== "success") {
    console.log("Redirecting to fail page because status is:", status);
    return res.redirect(`${config.frontend_url}/payment/fail`);
  }

  try {
    const result = await PaymentServices.executeBkashPayment(
      paymentID as string, 
      userId as string
    );
    
    return res.redirect(`${config.frontend_url}/payment/success?trxID=${result.trxID}`);
  } catch (error) {
    return res.redirect(`${config.frontend_url}/payment/fail`);
  }
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getAllPaymentsFromDB(req.query);

  res.status(httpStatus.OK).json({
    success: true,
    message: "All payments retrieved successfully",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.getSinglePaymentFromDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.updatePaymentStatusInDB(id, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Payment updated successfully",
    data: result,
  });
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.deletePaymentFromDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Payment deleted successfully",
    data: result,
  });
});

export const PaymentControllers = { 
  bkashCallback,
  getAllPayments,
  getSinglePayment,
  updatePaymentStatus,
  deletePayment
};