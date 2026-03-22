import { z } from "zod";

export const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }).min(2),
    parentId: z.string().optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  }),
});
