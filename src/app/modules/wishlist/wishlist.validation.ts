import { z } from "zod";

const toggleWishlistSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID"),
  }),
});

export const WishlistValidation = {
  toggleWishlistSchema,
};
