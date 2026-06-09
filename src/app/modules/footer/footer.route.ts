import { Router } from "express";
import { FooterControllers } from "./footer.controller";

const router = Router();

// Public endpoint to fetch dynamic footer data
router.get("/footer", FooterControllers.getFooter);

export const FooterRoutes = router;
