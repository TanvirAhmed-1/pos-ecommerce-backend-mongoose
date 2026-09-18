import { z } from "zod";

const createBannerSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }).min(1, "Title cannot be empty"),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
    imageUrl: z.string({ required_error: "Image URL is required" }).min(1, "Image URL is required"),
    bgColor: z.string().optional(),
    textColor: z.string().optional(),
    badgeColor: z.string().optional(),
    buttonBgColor: z.string().optional(),
    priority: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateBannerSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
    imageUrl: z.string().optional(),
    bgColor: z.string().optional(),
    textColor: z.string().optional(),
    badgeColor: z.string().optional(),
    buttonBgColor: z.string().optional(),
    priority: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

const reorderBannersSchema = z.object({
  body: z.object({
    orders: z.array(
      z.object({
        id: z.string(),
        priority: z.number(),
      })
    ),
  }),
});

export const BannerValidation = {
  createBannerSchema,
  updateBannerSchema,
  reorderBannersSchema,
};
