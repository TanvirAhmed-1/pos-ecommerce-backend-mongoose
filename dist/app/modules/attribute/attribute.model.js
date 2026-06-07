"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeModel = void 0;
const mongoose_1 = require("mongoose");
const attributeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    values: [{
            type: String,
            required: true,
            trim: true
        }],
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });
exports.AttributeModel = (0, mongoose_1.model)("Attribute", attributeSchema);
