"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        shippingAddress: zod_1.z.object({
            fullName: zod_1.z.string().min(3, "Full name is required"),
            phone: zod_1.z.string().min(11, "Valid phone number is required"),
            address: zod_1.z.string().min(5, "Detailed address is required"),
            city: zod_1.z.string().min(2, "City is required"),
        }),
        paymentMethod: zod_1.z.enum(["bkash", "nagad", "cod", "online_payment"]),
        deliveryType: zod_1.z.enum(["home_delivery", "pickup"]).default("home_delivery"),
        transactionId: zod_1.z.string().optional(), // বিকাশ বা নগদের জন্য এটি প্রয়োজনীয় হতে পারে
    }),
});
exports.OrderValidation = {
    createOrderSchema,
};
