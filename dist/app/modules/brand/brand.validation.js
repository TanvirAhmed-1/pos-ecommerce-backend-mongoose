"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandValidation = void 0;
const zod_1 = require("zod");
const createBrandZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ message: "Brand name is required" }),
        logo: zod_1.z.string({ message: "Brand logo is required" }),
        description: zod_1.z.string().optional(),
        website: zod_1.z.string().url().optional(),
        isFeatured: zod_1.z.boolean().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const updateBrandZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        logo: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        website: zod_1.z.string().url().optional(),
        isFeatured: zod_1.z.boolean().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.BrandValidation = {
    createBrandZodSchema,
    updateBrandZodSchema,
};
