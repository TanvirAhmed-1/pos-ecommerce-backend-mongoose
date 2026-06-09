import { Router } from "express";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { CompanyControllers } from "./company.controller";
import { CompanyValidation } from "./company.validation";

const router = Router();

router.get("/company", CompanyControllers.getCompany);

router.post(
  "/company",
  auth("admin", "superadmin"),
  validateData(CompanyValidation.createCompanyZodSchema),
  CompanyControllers.upsertCompany,
);

export const CompanyRoutes = router;
