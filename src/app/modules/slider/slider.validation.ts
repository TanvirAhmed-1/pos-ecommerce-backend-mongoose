import { z } from "zod";

const createSliderSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.string().url("Valid image URL is required"),
    link: z.string().optional(),
    priority: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateSliderSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.string().url().optional(),
    link: z.string().optional(),
    priority: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const SliderValidation = {
  createSliderSchema,
  updateSliderSchema,
};
