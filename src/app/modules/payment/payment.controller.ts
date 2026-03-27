import { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import config from "../../config";
import { PaymentServices } from "./payment.services";

const initBkash = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const userId = req.user.id;
  const paymentURL = await PaymentServices.initBkashPayment(orderId, userId);

  res.status(200).json({ success: true, data: paymentURL });
});

const bkashCallback = catchAsync(async (req: Request, res: Response) => {
  const { paymentID, status } = req.query;

  if (status !== "success") {
    return res.redirect(`${config.frontend_url}/payment/fail`);
  }

  try {
    const result = await PaymentServices.executeBkashPayment(
      paymentID as string,
    );
    return res.redirect(
      `${config.frontend_url}/payment/success?trxID=${result.trxID}`,
    );
  } catch (error) {
    return res.redirect(`${config.frontend_url}/payment/fail`);
  }
});

export const PaymentControllers = { initBkash, bkashCallback };
