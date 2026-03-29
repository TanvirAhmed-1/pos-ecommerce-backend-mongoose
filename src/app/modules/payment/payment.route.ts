import { Router } from "express";
import { PaymentControllers } from "./payment.controller";
import auth from "../../middlewares/auth";

const router = Router();
router.get("/bkash-callback", auth("user"), PaymentControllers.bkashCallback);

export const PaymentRoutes = router;