"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVariantSchema = exports.createVariantSchema = void 0;
const zod_1 = require("zod");
exports.createVariantSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z.string({ message: "Product ID is required" }),
        attributes: zod_1.z
            .array(zod_1.z.object({
            attribute: zod_1.z.string({ message: "Attribute ID is required" }),
            value: zod_1.z.string({ message: "Value is required" }),
        }))
            .min(1, "At least one attribute is required"),
        price: zod_1.z.number().positive("Price must be a positive number"),
        stock: zod_1.z.number().int().nonnegative("Stock cannot be negative"),
        sku: zod_1.z.string({ message: "SKU is required" }),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.updateVariantSchema = zod_1.z.object({
    body: zod_1.z.object({
        price: zod_1.z.number().positive().optional(),
        stock: zod_1.z.number().int().nonnegative().optional(),
        isActive: zod_1.z.boolean().optional(),
        attributes: zod_1.z
            .array(zod_1.z.object({
            attribute: zod_1.z.string(),
            value: zod_1.z.string(),
        }))
            .optional(),
    }),
});
