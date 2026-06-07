"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionModel = void 0;
const mongoose_1 = require("mongoose");
const sectionSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String },
    products: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Product", // আপনার Product মডেলের সাথে রিলেশন
        },
    ],
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
}, { timestamps: true });
exports.SectionModel = (0, mongoose_1.model)("Section", sectionSchema);
