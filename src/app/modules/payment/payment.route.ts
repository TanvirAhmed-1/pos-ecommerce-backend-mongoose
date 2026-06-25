import { Router } from "express";
import { PaymentControllers } from "./payment.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/bkash-callback", PaymentControllers.bkashCallback);

// Admin Routes
router.get("/payments", auth("admin", "superadmin"), PaymentControllers.getAllPayments);
router.get("/payments/:id", auth("admin", "superadmin"), PaymentControllers.getSinglePayment);
router.patch("/payments/:id", auth("admin", "superadmin"), PaymentControllers.updatePaymentStatus);
router.delete("/payments/:id", auth("admin", "superadmin"), PaymentControllers.deletePayment);

export const PaymentRoutes = router;
