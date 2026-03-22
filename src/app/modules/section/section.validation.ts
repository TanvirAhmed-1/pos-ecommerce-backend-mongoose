import { z } from "zod";

export const createSectionSchema = z.object({
  body: z.object({
    title: z.string({ message: "Title is required" }),
    description: z.string().optional(),
    products: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    displayOrder: z.number().optional(),
  }),
});
