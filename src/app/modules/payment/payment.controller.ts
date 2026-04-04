import { Request, Response } from "express";
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

export const PaymentControllers = { bkashCallback };