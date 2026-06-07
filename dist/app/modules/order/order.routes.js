"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateData_1 = __importDefault(require("../../middlewares/validateData"));
const order_validation_1 = require("./order.validation");
const router = (0, express_1.Router)();
router.use((0, auth_1.default)());
router.get("/my-orders", (0, auth_1.default)("user"), order_controller_1.OrderController.getMyOrders);
router.get("/order/:id", (0, auth_1.default)("user"), order_controller_1.OrderController.getSingleOrder);
router.post("/checkout", (0, auth_1.default)("user"), (0, validateData_1.default)(order_validation_1.OrderValidation.createOrderSchema), order_controller_1.OrderController.createOrder);
router.patch("/update-status/:id", (0, auth_1.default)("admin", "superadmin"), order_controller_1.OrderController.updateOrderStatus);
router.get("/all-orders", (0, auth_1.default)("admin", "superadmin"), order_controller_1.OrderController.getAllOrders);
exports.OrderRoutes = router;
