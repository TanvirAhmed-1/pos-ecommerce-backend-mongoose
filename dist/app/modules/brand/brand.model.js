"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brand = void 0;
const mongoose_1 = require("mongoose");
const brandSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    logo: { type: String, required: true }, // Cloudinary URL
    description: { type: String, trim: true },
    website: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.Brand = (0, mongoose_1.model)("Brand", brandSchema);
