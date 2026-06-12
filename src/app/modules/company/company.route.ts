import { Router } from "express";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { CompanyControllers } from "./company.controller";
import { CompanyValidation } from "./company.validation";
import { uploadCompanyFiles, parseMultipartBody } from "../../middlewares/upload";

const router = Router();

router.get("/company", CompanyControllers.getCompany);

router.post(
  "/company",
  auth("admin", "superadmin"),
  uploadCompanyFiles(),
  parseMultipartBody,
  validateData(CompanyValidation.createCompanyZodSchema),
  CompanyControllers.upsertCompany,
);

export const CompanyRoutes = router;
