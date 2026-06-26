import { Router } from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { OrderValidation } from "./order.validation";

const router = Router();
router.get("/my-orders", auth("customer", "reseller"), OrderController.getMyOrders);

router.get("/order/:id", auth("customer", "reseller"), OrderController.getSingleOrder);

router.post(
  "/checkout",
  auth("customer", "reseller"),
  validateData(OrderValidation.createOrderSchema),
  OrderController.createOrder,
);

router.patch(
  "/update-status/:id",
  auth("admin", "superadmin"),
  OrderController.updateOrderStatus,
);

router.get(
  "/all-orders",
  auth("admin", "superadmin"),
  OrderController.getAllOrders,
);

router.delete(
  "/delete-order/:id",
  auth("admin", "superadmin"),
  OrderController.deleteOrder,
);

export const OrderRoutes = router;
