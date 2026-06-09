import { z } from "zod";

const seoValidationSchema = z.object({
  metaTitle: z.string({ message: "Meta title is required" }).max(70, "Meta title should be under 70 characters"),
  metaDescription: z.string({ message: "Meta description is required" }).max(160, "Meta description should be under 160 characters"),
  metaKeywords: z.array(z.string()).default([]),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

const createPageZodSchema = z.object({
  body: z.object({
    title: z.string({ message: "Page title is required" }),
    slug: z.string().optional(),
    content: z.string({ message: "HTML content is required" }),
    group: z.string().default("Quick Links"),
    isActive: z.boolean().default(true),
    seo: seoValidationSchema,
  }),
});

const updatePageZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    content: z.string().optional(),
    group: z.string().optional(),
    isActive: z.boolean().optional(),
    seo: seoValidationSchema.partial().optional(),
  }),
});

export const PageValidation = {
  createPageZodSchema,
  updatePageZodSchema,
};
