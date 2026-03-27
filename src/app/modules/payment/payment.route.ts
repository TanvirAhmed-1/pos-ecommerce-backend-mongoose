import { Router } from "express";
import { PaymentControllers } from "./payment.controller";
import auth from "../../middlewares/auth";

const router = Router();

// ইউজার যখন চেকআউট করবে তখন পেমেন্ট শুরু হবে
router.post("/init-bkash", auth("user"), PaymentControllers.initBkash);

// বিকাশ এই ইউআরএলে ইউজারকে ব্যাক পাঠাবে
router.get("/bkash-callback", PaymentControllers.bkashCallback);

export const PaymentRoutes = router;