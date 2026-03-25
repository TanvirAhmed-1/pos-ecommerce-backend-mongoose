import { z } from "zod";

const createBrandZodSchema = z.object({
  body: z.object({
    name: z.string({ message: "Brand name is required" }),
    logo: z.string({ message: "Brand logo is required" }),
    description: z.string().optional(),
    website: z.string().url().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateBrandZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    logo: z.string().optional(),
    description: z.string().optional(),
    website: z.string().url().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const BrandValidation = {
  createBrandZodSchema,
  updateBrandZodSchema,
};
