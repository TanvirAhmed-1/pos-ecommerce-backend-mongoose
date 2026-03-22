import { z } from "zod";

const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      fullName: z.string().min(3, "Full name is required"),
      phone: z.string().min(11, "Valid phone number is required"),
      address: z.string().min(5, "Detailed address is required"),
      city: z.string().min(2, "City is required"),
    }),
    paymentMethod: z.enum(["bkash", "nagad", "cod", "online_payment"]),
    deliveryType: z.enum(["home_delivery", "pickup"]).default("home_delivery"),
    transactionId: z.string().optional(), // বিকাশ বা নগদের জন্য এটি প্রয়োজনীয় হতে পারে
  }),
});

export const OrderValidation = {
  createOrderSchema,
};
