import { z } from "zod";

export const createVariantSchema = z.object({
  body: z.object({
    product: z.string({ message: "Product ID is required" }),
    attributes: z
      .array(
        z.object({
          attribute: z.string({ message: "Attribute ID is required" }),
          value: z.string({ message: "Value is required" }),
        }),
      )
      .min(1, "At least one attribute is required"),
    price: z.number().positive("Price must be a positive number"),
    stock: z.number().int().nonnegative("Stock cannot be negative"),
    sku: z.string({ message: "SKU is required" }),
    isActive: z.boolean().optional(),
  }),
});

export const updateVariantSchema = z.object({
  body: z.object({
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
    attributes: z
      .array(
        z.object({
          attribute: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
  }),
});
