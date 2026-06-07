"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
// মঙ্গুজ অবজেক্ট আইডি ভ্যালিডেশন করার জন্য একটি হেল্পার
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");
const createProductSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z
            .string({
            message: "Product name is required",
        })
            .min(3, "Name must be at least 3 characters long")
            .max(255),
        shortDescription: zod_1.z
            .string({
            message: "Short description is required",
        })
            .min(10, "Short description must be at least 10 characters"),
        fullDescription: zod_1.z.string({
            message: "Full description is required",
        }),
        description: zod_1.z.string().optional(),
        // SEO Validation
        metaTitle: zod_1.z
            .string()
            .max(70, "Meta title should be under 70 characters")
            .optional(),
        metaDescription: zod_1.z
            .string()
            .max(160, "Meta description should be under 160 characters")
            .optional(),
        keywords: zod_1.z.array(zod_1.z.string()).default([]),
        // Relations
        category: objectIdSchema,
        subcategory: objectIdSchema.optional(),
        brand: objectIdSchema.optional(),
        // Media
        thumbnail: zod_1.z
            .string({
            message: "Thumbnail URL is required",
        })
            .url("Thumbnail must be a valid URL"),
        images: zod_1.z
            .array(zod_1.z.string().url("Each image must be a valid URL"))
            .default([]),
        // Pricing & Tax
        basePrice: zod_1.z
            .number({
            message: "Base price is required",
        })
            .nonnegative("Base price cannot be negative"),
        salePrice: zod_1.z
            .number({
            message: "Sale price is required",
        })
            .nonnegative("Sale price cannot be negative"),
        vat: zod_1.z.number().min(0).max(100, "VAT cannot exceed 100%").default(0),
        // Inventory & Status
        hasVariants: zod_1.z.boolean().default(false),
        totalStock: zod_1.z.number().int().nonnegative().default(0),
        visibility: zod_1.z
            .enum(["published", "hidden", "out_of_stock"])
            .default("published"),
        isActive: zod_1.z.boolean().default(true),
    })
        .refine((data) => data.salePrice <= data.basePrice, {
        message: "Sale price must be less than or equal to base price",
        path: ["salePrice"],
    }),
});
const updateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3).max(255).optional(),
        shortDescription: zod_1.z.string().min(10).optional(),
        fullDescription: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        metaTitle: zod_1.z.string().optional(),
        metaDescription: zod_1.z.string().optional(),
        keywords: zod_1.z.array(zod_1.z.string()).optional(),
        category: objectIdSchema.optional(),
        subcategory: objectIdSchema.optional(),
        brand: objectIdSchema.optional(),
        thumbnail: zod_1.z.string().url().optional(),
        images: zod_1.z.array(zod_1.z.string().url()).optional(),
        basePrice: zod_1.z.number().nonnegative().optional(),
        salePrice: zod_1.z.number().nonnegative().optional(),
        vat: zod_1.z.number().min(0).max(100).optional(),
        hasVariants: zod_1.z.boolean().optional(),
        totalStock: zod_1.z.number().int().nonnegative().optional(),
        visibility: zod_1.z.enum(["published", "hidden", "out_of_stock"]).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.ProductValidation = {
    createProductSchema,
    updateProductSchema,
};
