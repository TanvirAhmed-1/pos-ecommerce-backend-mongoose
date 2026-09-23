import { z } from "zod";

const createOrderSchema = z.object({
  body: z.object({
    address: z.string().optional(),
    shippingAddress: z
      .union([
        z.string(),
        z.object({
          fullName: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          division: z.string().optional(),
          district: z.string().optional(),
          upazila: z.string().optional(),
        }),
      ])
      .optional(),
    paymentMethod: z
      .enum([
        "bkash",
        "nagad",
        "cod",
        "online_payment",
        "cash",
        "card",
        "pos",
        "bank_transfer",
      ])
      .default("cod"),
    deliveryType: z
      .enum(["home_delivery", "pickup", "pos_takeaway"])
      .default("home_delivery"),
    deliveryCharge: z.number().min(0).optional(),
    deliveryMethod: z.string().optional(),
    couponCode: z.string().optional(),
    discount: z.number().min(0).optional(),
    orderNumber: z.string().optional(),
    transactionId: z.string().optional(),
    notes: z.string().optional(),
    email: z.string().optional(),
  }),
});

export const OrderValidation = {
  createOrderSchema,
};
