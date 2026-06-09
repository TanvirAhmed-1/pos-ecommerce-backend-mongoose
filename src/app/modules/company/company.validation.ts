import { z } from "zod";

const socialMediaValidationSchema = z.object({
  platform: z.string({ message: "Platform is required" }),
  url: z.string({ message: "URL is required" }).url("Invalid social media URL"),
});

const seoValidationSchema = z.object({
  metaTitle: z.string({ message: "Meta title is required" }).max(70, "Meta title should be under 70 characters"),
  metaDescription: z.string({ message: "Meta description is required" }).max(160, "Meta description should be under 160 characters"),
  metaKeywords: z.array(z.string()).default([]),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url("Invalid OG image URL").optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().url("Invalid Twitter image URL").optional(),
  canonicalUrl: z.string().url("Invalid canonical URL").optional(),
});

const createCompanyZodSchema = z.object({
  body: z.object({
    name: z.string({ message: "Company name is required" }),
    logo: z.string({ message: "Company logo is required" }).url("Invalid logo URL"),
    favicon: z.string().url("Invalid favicon URL").optional(),
    email: z.string({ message: "Email is required" }).email("Invalid email address"),
    phone: z.string({ message: "Phone is required" }),
    address: z.string({ message: "Address is required" }),
    socialMedia: z.array(socialMediaValidationSchema).default([]),
    googleMap: z.string().optional(),
    seo: seoValidationSchema.optional(),
    description: z.string().optional(),
    copyright: z.string().optional(),
    isActive: z.boolean().default(true),
  }),
});

const updateCompanyZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    logo: z.string().url("Invalid logo URL").optional(),
    favicon: z.string().url("Invalid favicon URL").optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    socialMedia: z.array(socialMediaValidationSchema).optional(),
    googleMap: z.string().optional(),
    seo: seoValidationSchema.partial().optional(),
    description: z.string().optional(),
    copyright: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const CompanyValidation = {
  createCompanyZodSchema,
  updateCompanyZodSchema,
};
