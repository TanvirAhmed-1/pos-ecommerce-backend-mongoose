import { z } from "zod";

// মঙ্গুজ অবজেক্ট আইডি ভ্যালিডেশন করার জন্য একটি হেল্পার
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const createProductSchema = z.object({
  body: z.object({
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

    description: z.string().optional(),
    keyFeatures: z.array(z.string()).optional(),
    specifications: z
      .array(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      )
      .optional(),
    warrantyPolicy: z.string().optional(),

    // SEO Validation
    seo: z
      .object({
        metaTitle: z.string().max(70, "Meta title should be under 70 characters").optional(),
        metaDescription: z.string().max(160, "Meta description should be under 160 characters").optional(),
        metaKeywords: z.array(z.string()).default([]),
        ogTitle: z.string().optional(),
        ogDescription: z.string().optional(),
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

    wholesalePrice: z.number().nonnegative().optional().default(0),

    discountType: z.enum(["flat", "percentage"]).default("flat"),
    productDiscount: z.number().nonnegative().default(0),

    vatType: z.enum(["percentage", "flat"]).default("percentage").optional(),
    vat: z.number().nonnegative("VAT cannot be negative").default(0),

    // Inventory & Status
    hasVariants: z.boolean().default(false),
    totalStock: z.number().int().nonnegative().default(0),

    visibility: z
      .enum(["published", "hidden", "out_of_stock"])
      .default("published"),
    isActive: z.boolean().default(true),

    // Base Info Fields
    productCode: z.string().optional(),
    materials: z.string().optional(),
    unitMeasure: z.string().optional(),
    gender: z.string().optional(),
    barcode: z.string().optional(),
    weight: z.number().nonnegative().optional(),

    // New Design Fields
    sku: z.string().optional(),
    isRecommended: z.boolean().default(false).optional(),
    isCategoryProduct: z.boolean().default(false).optional(),
    isTopSelling: z.boolean().default(false).optional(),
    variants: z.array(z.any()).optional(),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(255).optional(),
    shortDescription: z.string().min(10).optional(),
    description: z.string().optional(),
    keyFeatures: z.array(z.string()).optional(),
    specifications: z
      .array(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      )
      .optional(),
    warrantyPolicy: z.string().optional(),
    seo: z
      .object({
        metaTitle: z.string().max(70).optional(),
        metaDescription: z.string().max(160).optional(),
        metaKeywords: z.array(z.string()).optional(),
        ogTitle: z.string().optional(),
        ogDescription: z.string().optional(),
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
    wholesalePrice: z.number().nonnegative().optional(),
    discountType: z.enum(["flat", "percentage"]).optional(),
    productDiscount: z.number().nonnegative().optional(),
    vatType: z.enum(["percentage", "flat"]).optional(),
    vat: z.number().nonnegative().optional(),
    hasVariants: z.boolean().optional(),
    totalStock: z.number().int().nonnegative().optional(),
    visibility: z.enum(["published", "hidden", "out_of_stock"]).optional(),
    isActive: z.boolean().optional(),
    productCode: z.string().optional(),
    materials: z.string().optional(),
    unitMeasure: z.string().optional(),
    gender: z.string().optional(),
    barcode: z.string().optional(),
    weight: z.number().nonnegative().optional(),
    sku: z.string().optional(),
    isRecommended: z.boolean().optional(),
    isCategoryProduct: z.boolean().optional(),
    isTopSelling: z.boolean().optional(),
    variants: z.array(z.any()).optional(),
  }),
});

export const ProductValidation = {
  createProductSchema,
  updateProductSchema,
};
