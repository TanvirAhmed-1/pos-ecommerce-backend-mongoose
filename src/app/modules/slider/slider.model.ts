import { Schema, model } from "mongoose";
import { ISlider } from "./slider.interface";

const sliderSchema = new Schema<ISlider>(
  {
    title: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

sliderSchema.index({ priority: 1 });

export const SliderModel = model<ISlider>("Slider", sliderSchema);
