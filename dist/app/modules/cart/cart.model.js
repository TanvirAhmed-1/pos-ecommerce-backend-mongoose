"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
const mongoose_1 = require("mongoose");
const cartItemSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: mongoose_1.Schema.Types.ObjectId, ref: "Variant", required: true },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1"],
        default: 1,
    },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
});
const cartSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    items: [cartItemSchema],
    totalItems: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
}, { timestamps: true });
// --- Pre-save Hook for Totals ---
cartSchema.pre("save", async function () {
    this.totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);
    this.totalAmount = this.items.reduce((acc, item) => acc + item.totalPrice, 0);
});
exports.CartModel = (0, mongoose_1.model)("Cart", cartSchema);
