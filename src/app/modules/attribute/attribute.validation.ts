import { z } from "zod";

const createAttributeZodSchema = z.object({
  body: z.object({
    name: z.string({ message: "Attribute name is required" }),
    values: z.array(z.string()).min(1, "At least one value is required"),
    isActive: z.boolean().optional(),
  }),
});

const updateAttributeZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    values: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const AttributeValidation = {
  createAttributeZodSchema,
  updateAttributeZodSchema,
};
