"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderModel = void 0;
const mongoose_1 = require("mongoose");
const sliderSchema = new mongoose_1.Schema({
    title: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
sliderSchema.index({ priority: 1 });
exports.SliderModel = (0, mongoose_1.model)("Slider", sliderSchema);
