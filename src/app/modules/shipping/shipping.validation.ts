import { z } from "zod";

export const updateDistrictSchema = z.object({
  body: z.object({
    bnName: z.string().optional(),
    deliveryCharge: z.number().min(0).optional(),
    expressDeliveryCharge: z.number().min(0).optional(),
    estimatedDeliveryDays: z.string().optional(),
    isInsideDhaka: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createDistrictSchema = z.object({
  body: z.object({
    name: z.string().min(1, "District English name is required"),
    bnName: z.string().min(1, "District Bengali name is required"),
    division: z.string().min(1, "Division name is required"),
    deliveryCharge: z.number().min(0).default(130),
    expressDeliveryCharge: z.number().min(0).default(180),
    estimatedDeliveryDays: z.string().default("2-4 Days"),
    isInsideDhaka: z.boolean().default(false),
    isActive: z.boolean().default(true),
  }),
});

export const createUpazilaSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Upazila/Area English name is required"),
    bnName: z.string().min(1, "Upazila/Area Bengali name is required"),
    district: z.string().min(1, "District name is required"),
    deliveryChargeOverride: z.number().min(0).optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateUpazilaSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    bnName: z.string().optional(),
    deliveryChargeOverride: z.number().min(0).nullable().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const bulkUpdateChargesSchema = z.object({
  body: z.object({
    scope: z.enum(["all", "inside_dhaka", "outside_dhaka", "division"]),
    divisionName: z.string().optional(),
    deliveryCharge: z.number().min(0).optional(),
    expressDeliveryCharge: z.number().min(0).optional(),
  }),
});

export const updateShippingSettingsSchema = z.object({
  body: z.object({
    insideDhakaDeliveryCharge: z.number().min(0).optional(),
    outsideDhakaDeliveryCharge: z.number().min(0).optional(),
    insideDhakaExpressCharge: z.number().min(0).optional(),
    outsideDhakaExpressCharge: z.number().min(0).optional(),
    freeDeliveryThreshold: z.number().min(0).optional(),
    estimatedDaysInsideDhaka: z.string().optional(),
    estimatedDaysOutsideDhaka: z.string().optional(),
    notes: z.string().optional(),
  }),
});
