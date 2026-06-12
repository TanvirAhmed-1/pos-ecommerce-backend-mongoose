import { Router } from "express";
import { ProductController } from "./product.controller";
import { ProductValidation } from "./product.validation";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { uploadProductFiles, parseMultipartBody } from "../../middlewares/upload";

const router = Router();
// Public Routes
router.get("/product", ProductController.getAllProducts);
router.get("/product/:slug", ProductController.getSingleProduct);

// Admin Only Routes
router.post(
  "/create-product",
  auth("admin", "superadmin"),
  uploadProductFiles(),
  parseMultipartBody,
  validateData(ProductValidation.createProductSchema),
  ProductController.createProduct,
);

router.patch(
  "/product-update/:id",
  auth("admin", "superadmin"),
  uploadProductFiles(),
  parseMultipartBody,
  validateData(ProductValidation.updateProductSchema),
  ProductController.updateProduct,
);

router.delete(
  "/delete-product/:id",
  auth("admin", "superadmin"),
  ProductController.deleteProduct,
);

export const ProductRoutes = router;
