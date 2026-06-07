"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeValidation = void 0;
const zod_1 = require("zod");
const createAttributeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ message: "Attribute name is required" }),
        values: zod_1.z.array(zod_1.z.string()).min(1, "At least one value is required"),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const updateAttributeZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        values: zod_1.z.array(zod_1.z.string()).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.AttributeValidation = {
    createAttributeZodSchema,
    updateAttributeZodSchema,
};
