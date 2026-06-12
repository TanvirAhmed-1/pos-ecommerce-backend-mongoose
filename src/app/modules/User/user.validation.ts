import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10, "Phone must be valid"),
    role: z.enum(["customer", "reseller", "admin", "superadmin"]).optional(),
    companyName: z.string().optional(),
    tradeLicense: z.string().optional(),
    resellerDiscount: z.number().optional(),
    status: z.enum(["active", "inactive", "blocked"]).optional(),
    avatar: z.string().optional(),
  }),
});
