"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSectionSchema = void 0;
const zod_1 = require("zod");
exports.createSectionSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ message: "Title is required" }),
        description: zod_1.z.string().optional(),
        products: zod_1.z.array(zod_1.z.string()).optional(),
        isActive: zod_1.z.boolean().optional(),
        displayOrder: zod_1.z.number().optional(),
    }),
});
