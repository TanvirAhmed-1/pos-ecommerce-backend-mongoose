import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be valid"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().optional(),
});
