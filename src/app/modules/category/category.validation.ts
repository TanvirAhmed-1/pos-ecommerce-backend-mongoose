import { z } from "zod";

export const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }).min(2),
    parentId: z.string().optional(),
    isActive: z.boolean().optional(),
    showInFooter: z.boolean().optional(),
    showInNavbar: z.boolean().optional(),
    slug: z.string().optional(),
  }),
});
