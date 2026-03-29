import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

const router = Router();
router.get("/bkash-callback", PaymentControllers.bkashCallback);

export const PaymentRoutes = router;
