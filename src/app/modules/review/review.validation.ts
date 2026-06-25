import { z } from "zod";

const createReviewZodSchema = z.object({
  body: z.object({
    product: z.string({ message: "Product ID is required" }),
    rating: z.number({ message: "Rating is required" }).min(1).max(5),
    message: z.string({ message: "Message is required" }).min(5, "Message must be at least 5 characters long"),
    images: z.array(z.string()).optional(),
  }),
});

const updateReviewStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(["active", "hidden"], { message: "Status must be active or hidden" }),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewStatusZodSchema,
};
