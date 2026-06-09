import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10, "Phone must be valid"),
    gender: z.enum(["male", "female", "other"]),
    address: z.string().optional(),
    role: z.enum(["user", "admin", "superadmin"]).optional(),
  }),
});
