"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistValidation = void 0;
const zod_1 = require("zod");
const toggleWishlistSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID"),
    }),
});
exports.WishlistValidation = {
    toggleWishlistSchema,
};
