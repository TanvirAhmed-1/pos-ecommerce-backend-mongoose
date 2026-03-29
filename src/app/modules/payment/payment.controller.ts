import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import config from "../../config";
import { PaymentServices } from "./payment.services";


const bkashCallback = catchAsync(async (req: Request, res: Response) => {
  const { paymentID, status } = req.query;
  const userId = req.user.id;

  if (status !== "success") return res.redirect(`${config.frontend_url}/payment/fail`);

  try {
    const result = await PaymentServices.executeBkashPayment(paymentID as string, userId);
    return res.redirect(`${config.frontend_url}/payment/success?trxID=${result.trxID}`);
  } catch (error) {
    return res.redirect(`${config.frontend_url}/payment/fail`);
  }
});

export const PaymentControllers = { bkashCallback };