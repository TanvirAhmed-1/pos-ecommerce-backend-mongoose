"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderValidation = void 0;
const zod_1 = require("zod");
const createSliderSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        image: zod_1.z.string().url("Valid image URL is required"),
        link: zod_1.z.string().optional(),
        priority: zod_1.z.number().int().nonnegative().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const updateSliderSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        link: zod_1.z.string().optional(),
        priority: zod_1.z.number().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.SliderValidation = {
    createSliderSchema,
    updateSliderSchema,
};
