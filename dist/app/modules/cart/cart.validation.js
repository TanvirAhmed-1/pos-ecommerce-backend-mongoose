"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartValidation = void 0;
const zod_1 = require("zod");
const addToCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID"),
        variant: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Variant ID"),
        quantity: zod_1.z.number().int().positive("Quantity must be at least 1"),
    }),
});
exports.CartValidation = {
    addToCartSchema,
};
