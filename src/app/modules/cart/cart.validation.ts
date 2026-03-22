import { z } from "zod";

const addToCartSchema = z.object({
  body: z.object({
    product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID"),
    variant: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Variant ID"),
    quantity: z.number().int().positive("Quantity must be at least 1"),
  }),
});

export const CartValidation = {
  addToCartSchema,
};
