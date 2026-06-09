import { z } from "zod";

// মঙ্গুজ অবজেক্ট আইডি ভ্যালিডেশন করার জন্য একটি হেল্পার
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const createProductSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          message: "Product name is required",
        })
        .min(3, "Name must be at least 3 characters long")
        .max(255),

      shortDescription: z
        .string({
          message: "Short description is required",
        })
        .min(10, "Short description must be at least 10 characters"),

      fullDescription: z.string({
        message: "Full description is required",
      }),

      description: z.string().optional(),

      // SEO Validation
      seo: z
        .object({
          metaTitle: z.string().max(70, "Meta title should be under 70 characters").optional(),
          metaDescription: z.string().max(160, "Meta description should be under 160 characters").optional(),
          metaKeywords: z.array(z.string()).default([]),
          ogTitle: z.string().optional(),
          ogDescription: z.string().optional(),
          ogImage: z.string().url("Invalid OG image URL").optional(),
          twitterTitle: z.string().optional(),
          twitterDescription: z.string().optional(),
          twitterImage: z.string().url("Invalid Twitter image URL").optional(),
          canonicalUrl: z.string().url("Invalid canonical URL").optional(),
        })
        .optional(),

      // Relations
      company: objectIdSchema.optional(),
      category: objectIdSchema,
      subcategory: objectIdSchema.optional(),
      brand: objectIdSchema.optional(),

      // Media
      thumbnail: z
        .string({
          message: "Thumbnail URL is required",
        })
        .url("Thumbnail must be a valid URL"),

      images: z
        .array(z.string().url("Each image must be a valid URL"))
        .default([]),

      // Pricing & Tax
      basePrice: z
        .number({
          message: "Base price is required",
        })
        .nonnegative("Base price cannot be negative"),

      salePrice: z
        .number({
          message: "Sale price is required",
        })
        .nonnegative("Sale price cannot be negative"),

      vat: z.number().min(0).max(100, "VAT cannot exceed 100%").default(0),

      // Inventory & Status
      hasVariants: z.boolean().default(false),
      totalStock: z.number().int().nonnegative().default(0),

      visibility: z
        .enum(["published", "hidden", "out_of_stock"])
        .default("published"),
      isActive: z.boolean().default(true),
    })
    .refine((data) => data.salePrice <= data.basePrice, {
      message: "Sale price must be less than or equal to base price",
      path: ["salePrice"],
    }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(255).optional(),
    shortDescription: z.string().min(10).optional(),
    fullDescription: z.string().optional(),
    description: z.string().optional(),
    seo: z
      .object({
        metaTitle: z.string().max(70).optional(),
        metaDescription: z.string().max(160).optional(),
        metaKeywords: z.array(z.string()).optional(),
        ogTitle: z.string().optional(),
        ogDescription: z.string().optional(),
        ogImage: z.string().url().optional(),
        twitterTitle: z.string().optional(),
        twitterDescription: z.string().optional(),
        twitterImage: z.string().url().optional(),
        canonicalUrl: z.string().url().optional(),
      })
      .optional(),
    company: objectIdSchema.optional(),
    category: objectIdSchema.optional(),
    subcategory: objectIdSchema.optional(),
    brand: objectIdSchema.optional(),
    thumbnail: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    basePrice: z.number().nonnegative().optional(),
    salePrice: z.number().nonnegative().optional(),
    vat: z.number().min(0).max(100).optional(),
    hasVariants: z.boolean().optional(),
    totalStock: z.number().int().nonnegative().optional(),
    visibility: z.enum(["published", "hidden", "out_of_stock"]).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ProductValidation = {
  createProductSchema,
  updateProductSchema,
};
