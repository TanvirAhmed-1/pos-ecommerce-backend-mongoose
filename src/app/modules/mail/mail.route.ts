import { Router } from "express";
import { MailController } from "./mail.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Admin/Superadmin only
router.post("/mail/send", auth("admin", "superadmin"), MailController.sendMail);
router.post("/mail/send-all", auth("admin", "superadmin"), MailController.sendToAllCustomers);
router.get("/mail/all", auth("admin", "superadmin"), MailController.getAllMails);
router.get("/mail/:id", auth("admin", "superadmin"), MailController.getMailById);
router.delete("/mail/:id", auth("admin", "superadmin"), MailController.deleteMail);

export const MailRoutes = router;
