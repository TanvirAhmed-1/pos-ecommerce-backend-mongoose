import { z } from "zod";

export const createVariantSchema = z.object({
  body: z.object({
    product: z.string({ message: "Product ID is required" }),
    attributeName: z.string(),
    attributeValue: z.string(),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    sku: z.string(),
    isActive: z.boolean().optional(),
  }),
});

export const updateVariantSchema = z.object({
  body: z.object({
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
  }),
});
