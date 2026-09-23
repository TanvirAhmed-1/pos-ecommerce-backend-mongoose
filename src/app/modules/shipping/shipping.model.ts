import { Schema, model } from "mongoose";
import {
  IDivision,
  IDistrict,
  IUpazila,
  IShippingSettings,
} from "./shipping.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    bnName: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const districtSchema = new Schema<IDistrict>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    bnName: { type: String, required: true, trim: true },
    division: { type: String, required: true, trim: true },
    divisionRef: { type: Schema.Types.ObjectId, ref: "Division" },
    deliveryCharge: { type: Number, required: true, default: 130 },
    expressDeliveryCharge: { type: Number, default: 180 },
    estimatedDeliveryDays: { type: String, default: "2-4 Days" },
    isInsideDhaka: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const upazilaSchema = new Schema<IUpazila>(
  {
    name: { type: String, required: true, trim: true },
    bnName: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    districtRef: { type: Schema.Types.ObjectId, ref: "District" },
    deliveryChargeOverride: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Unique compound index for upazila per district
upazilaSchema.index({ name: 1, district: 1 }, { unique: true });

const shippingSettingsSchema = new Schema<IShippingSettings>(
  {
    insideDhakaDeliveryCharge: { type: Number, default: 70 },
    outsideDhakaDeliveryCharge: { type: Number, default: 130 },
    insideDhakaExpressCharge: { type: Number, default: 120 },
    outsideDhakaExpressCharge: { type: Number, default: 180 },
    freeDeliveryThreshold: { type: Number, default: 0 },
    estimatedDaysInsideDhaka: { type: String, default: "1-2 Days" },
    estimatedDaysOutsideDhaka: { type: String, default: "2-4 Days" },
    notes: { type: String, default: "Standard home delivery all over Bangladesh." },
  },
  { timestamps: true }
);

export const DivisionModel = model<IDivision>("Division", divisionSchema);
export const DistrictModel = model<IDistrict>("District", districtSchema);
export const UpazilaModel = model<IUpazila>("Upazila", upazilaSchema);
export const ShippingSettingModel = model<IShippingSettings>(
  "ShippingSetting",
  shippingSettingsSchema
);
