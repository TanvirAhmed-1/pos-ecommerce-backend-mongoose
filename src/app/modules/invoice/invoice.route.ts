import { Router } from "express";
import { InvoiceController } from "./invoice.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Protect all routes with auth
router.use(auth());

// Generate invoice (triggered after payment, or manually)
router.post("/invoice/generate", auth("customer", "reseller", "admin", "superadmin"), InvoiceController.generateInvoice);

// Get my invoices (for customer or reseller)
router.get("/invoice/my-invoices", auth("customer", "reseller"), InvoiceController.getMyInvoices);

// Get all invoices (admin/superadmin only)
router.get("/invoice/all-invoices", auth("admin", "superadmin"), InvoiceController.getAllInvoices);

// Get invoice by order ID
router.get("/invoice/order/:orderId", auth("customer", "reseller", "admin", "superadmin"), InvoiceController.getInvoiceByOrderId);

// Get single invoice by ID
router.get("/invoice/:id", auth("customer", "reseller", "admin", "superadmin"), InvoiceController.getInvoiceById);

export const InvoiceRoutes = router;
