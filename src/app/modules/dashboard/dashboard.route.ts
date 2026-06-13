import { Router } from "express";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get("/overview", DashboardController.getOverview);
router.get("/dashboard/analytics", DashboardController.getAnalytics);

export const DashboardRoutes = router;
