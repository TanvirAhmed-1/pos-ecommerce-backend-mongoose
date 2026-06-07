"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    level: { type: Number, default: 0 },
    parentCategory: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    ancestors: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Category'
        }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });
// Indexing for faster search
categorySchema.index({ level: 1 });
exports.CategoryModel = (0, mongoose_1.model)('Category', categorySchema);
