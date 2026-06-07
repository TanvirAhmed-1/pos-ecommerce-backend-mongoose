"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantModel = void 0;
const mongoose_1 = require("mongoose");
require("../attribute/attribute.model");
const variantSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required"],
    },
    attributes: [
        {
            attribute: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Attribute",
                required: true,
            },
            value: { type: String, required: true },
        },
    ],
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
variantSchema.index({ sku: 1, product: 1 });
exports.VariantModel = (0, mongoose_1.model)("Variant", variantSchema);
