import { z } from "zod";

export const bangladeshiPhoneRegex = /^(?:\+?88|88)?01[3-9]\d{8}$/;

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: "পুরো নাম লিখুন" })
      .trim()
      .min(2, "পুরো নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
    phone: z
      .string({ required_error: "মোবাইল নম্বর আবশ্যক" })
      .trim()
      .regex(bangladeshiPhoneRegex, "সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)"),
    email: z
      .string()
      .trim()
      .email("সঠিক ইমেইল ঠিকানা দিন")
      .optional()
      .or(z.literal("")),
    division: z.string().optional(),
    district: z
      .string({ required_error: "জেলা সিলেক্ট করুন" })
      .trim()
      .min(1, "জেলা সিলেক্ট করুন"),
    upazila: z
      .string({ required_error: "উপজেলা/এরিয়া সিলেক্ট করুন" })
      .trim()
      .min(1, "উপজেলা/এরিয়া সিলেক্ট করুন"),
    address: z
      .string({ required_error: "বিস্তারিত ঠিকানা দিন" })
      .trim()
      .min(3, "বিস্তারিত ঠিকানা কমপক্ষে ৩ অক্ষরের হতে হবে"),
    notes: z.string().trim().optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "পুরো নাম কমপক্ষে ২ অক্ষরের হতে হবে")
      .optional(),
    phone: z
      .string()
      .trim()
      .regex(bangladeshiPhoneRegex, "সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)")
      .optional(),
    email: z
      .string()
      .trim()
      .email("সঠিক ইমেইল ঠিকানা দিন")
      .optional()
      .or(z.literal("")),
    division: z.string().optional(),
    district: z.string().trim().min(1, "জেলা সিলেক্ট করুন").optional(),
    upazila: z.string().trim().min(1, "উপজেলা/এরিয়া সিলেক্ট করুন").optional(),
    address: z.string().trim().min(3, "বিস্তারিত ঠিকানা কমপক্ষে ৩ অক্ষরের হতে হবে").optional(),
    notes: z.string().trim().optional(),
    isDefault: z.boolean().optional(),
  }),
});
