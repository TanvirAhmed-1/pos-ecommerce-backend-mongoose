import { z } from "zod";

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z.string({ message: "Full name is required" }),
    phone: z.string({ message: "Phone is required" }),
    division: z.string({ message: "Division is required" }),
    district: z.string({ message: "District is required" }),
    upazila: z.string({ message: "Upazila is required" }),
    address: z.string({ message: "Address is required" }),
    isDefault: z.boolean().optional(),
  }),
});
