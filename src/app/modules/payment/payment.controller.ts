import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import config from "../../config";
import { PaymentServices } from "./payment.services";


const bkashCallback = catchAsync(async (req: Request, res: Response) => {
  // ১. userId এখন query থেকে আসবে (যেহেতু আমরা সার্ভিসে এটি যোগ করেছি)
  const { paymentID, status, userId } = req.query;

  console.log("bKash Callback Received:", { status, paymentID, userId });

  // ২. যদি স্ট্যাটাস success না হয় (যেমন: failure, cancel)
  if (status !== "success") {
    console.log("Redirecting to fail page because status is:", status);
    return res.redirect(`${config.frontend_url}/payment/fail`);
  }

  try {
    // ৩. সাকসেস হলে Execute করা
    const result = await PaymentServices.executeBkashPayment(
      paymentID as string, 
      userId as string
    );
    
    return res.redirect(`${config.frontend_url}/payment/success?trxID=${result.trxID}`);
  } catch (error) {
    console.error("Execute Error:", error);
    // ৪. যদি Execute করতে গিয়ে কোনো এরর হয় (যেমন: টোকেন এক্সপায়ার)
    return res.redirect(`${config.frontend_url}/payment/fail`);
  }
});

export const PaymentControllers = { bkashCallback };