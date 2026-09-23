import { Document, Types } from "mongoose";

export interface IDivision extends Document {
  name: string;
  bnName: string;
  order?: number;
  isActive: boolean;
}

export interface IDistrict extends Document {
  name: string;
  bnName: string;
  division: string;
  divisionRef?: Types.ObjectId;
  deliveryCharge: number;
  expressDeliveryCharge: number;
  estimatedDeliveryDays?: string;
  isInsideDhaka: boolean;
  isActive: boolean;
}

export interface IUpazila extends Document {
  name: string;
  bnName: string;
  district: string;
  districtRef?: Types.ObjectId;
  deliveryChargeOverride?: number;
  isActive: boolean;
}

export interface IShippingSettings extends Document {
  insideDhakaDeliveryCharge: number;
  outsideDhakaDeliveryCharge: number;
  insideDhakaExpressCharge: number;
  outsideDhakaExpressCharge: number;
  freeDeliveryThreshold?: number;
  estimatedDaysInsideDhaka?: string;
  estimatedDaysOutsideDhaka?: string;
  notes?: string;
}

export interface IBulkUpdateChargesPayload {
  scope: "all" | "inside_dhaka" | "outside_dhaka" | "division";
  divisionName?: string;
  deliveryCharge?: number;
  expressDeliveryCharge?: number;
}
