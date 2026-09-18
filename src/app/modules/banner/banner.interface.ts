import { Document } from "mongoose";

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl: string;
  bgColor?: string;
  textColor?: string;
  badgeColor?: string;
  buttonBgColor?: string;
  priority: number;
  isActive: boolean;
}
