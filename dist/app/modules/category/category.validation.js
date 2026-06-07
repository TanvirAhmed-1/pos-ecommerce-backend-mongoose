"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryZodSchema = void 0;
const zod_1 = require("zod");
exports.createCategoryZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ message: "Name is required" }).min(2),
        parentId: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
        isFeatured: zod_1.z.boolean().optional(),
    }),
});
