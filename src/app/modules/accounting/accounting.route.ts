import { Router } from "express";
import { AccountingController } from "./accounting.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
  "/transaction",
  auth("admin", "superadmin"),
  AccountingController.createTransaction
);

router.get(
  "/transactions",
  auth("admin", "superadmin"),
  AccountingController.getAllTransactions
);

router.get(
  "/summary",
  auth("admin", "superadmin"),
  AccountingController.getAccountingSummary
);

router.patch(
  "/transaction/:id",
  auth("admin", "superadmin"),
  AccountingController.updateTransaction
);

router.delete(
  "/transaction/:id",
  auth("admin", "superadmin"),
  AccountingController.deleteTransaction
);

export const AccountingRoutes = router;
