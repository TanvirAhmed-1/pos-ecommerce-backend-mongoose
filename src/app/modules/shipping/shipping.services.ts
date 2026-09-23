import {
  DivisionModel,
  DistrictModel,
  UpazilaModel,
  ShippingSettingModel,
} from "./shipping.model";
import { IBulkUpdateChargesPayload } from "./shipping.interface";
import { seedBangladeshLocations } from "../../seed/seedBangladeshLocations";

/**
 * Public hierarchy of divisions, active districts with delivery charges, and upazilas.
 * Optimized for customer checkout and location pickers.
 */
const getPublicLocations = async () => {
  // If database is completely empty for districts, run seed on demand
  const count = await DistrictModel.countDocuments();
  if (count === 0) {
    await seedBangladeshLocations(true);
  }

  const [divisions, districts, upazilas, settings] = await Promise.all([
    DivisionModel.find({ isActive: true }).sort({ order: 1, name: 1 }).lean(),
    DistrictModel.find({ isActive: true }).sort({ name: 1 }).lean(),
    UpazilaModel.find({ isActive: true }).sort({ name: 1 }).lean(),
    ShippingSettingModel.findOne().lean(),
  ]);

  return {
    divisions,
    districts,
    upazilas,
    settings: settings || {
      insideDhakaDeliveryCharge: 70,
      outsideDhakaDeliveryCharge: 130,
      insideDhakaExpressCharge: 120,
      outsideDhakaExpressCharge: 180,
    },
  };
};

/**
 * Get all districts with optional filtering and pagination
 */
const getAllDistricts = async (query: Record<string, any>) => {
  const filter: Record<string, any> = {};

  if (query.division) {
    filter.division = query.division;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true" || query.isActive === true;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, "i");
    filter.$or = [{ name: searchRegex }, { bnName: searchRegex }];
  }

  const districts = await DistrictModel.find(filter)
    .populate("divisionRef", "name bnName")
    .sort({ isInsideDhaka: -1, name: 1 })
    .lean();

  return districts;
};

/**
 * Update single district details / delivery charge
 */
const updateDistrict = async (id: string, payload: any) => {
  const updated = await DistrictModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new Error("District not found");
  }
  return updated;
};

/**
 * Create custom district
 */
const createDistrict = async (payload: any) => {
  const existing = await DistrictModel.findOne({ name: payload.name });
  if (existing) {
    throw new Error(`District with name "${payload.name}" already exists`);
  }
  const created = await DistrictModel.create(payload);
  return created;
};

/**
 * Delete district
 */
const deleteDistrict = async (id: string) => {
  const district = await DistrictModel.findById(id);
  if (!district) {
    throw new Error("District not found");
  }
  await UpazilaModel.deleteMany({ district: district.name });
  await DistrictModel.findByIdAndDelete(id);
  return { message: "District and associated upazilas removed" };
};

/**
 * Get upazilas / areas with optional filter by district
 */
const getUpazilas = async (query: Record<string, any>) => {
  const filter: Record<string, any> = {};

  if (query.district) {
    filter.district = query.district;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, "i");
    filter.$or = [{ name: searchRegex }, { bnName: searchRegex }];
  }

  const upazilas = await UpazilaModel.find(filter)
    .populate("districtRef", "name bnName deliveryCharge")
    .sort({ name: 1 })
    .lean();

  return upazilas;
};

/**
 * Create new Upazila/Area
 */
const createUpazila = async (payload: any) => {
  const existing = await UpazilaModel.findOne({
    name: payload.name,
    district: payload.district,
  });
  if (existing) {
    throw new Error(
      `Upazila "${payload.name}" already exists in ${payload.district}`
    );
  }

  const districtDoc = await DistrictModel.findOne({ name: payload.district });
  if (districtDoc) {
    payload.districtRef = districtDoc._id;
  }

  const created = await UpazilaModel.create(payload);
  return created;
};

/**
 * Update Upazila/Area
 */
const updateUpazila = async (id: string, payload: any) => {
  const updated = await UpazilaModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new Error("Upazila not found");
  }
  return updated;
};

/**
 * Delete Upazila
 */
const deleteUpazila = async (id: string) => {
  const deleted = await UpazilaModel.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error("Upazila not found");
  }
  return { message: "Upazila deleted successfully" };
};

/**
 * Bulk update delivery charges across districts
 */
const bulkUpdateDistrictCharges = async (payload: IBulkUpdateChargesPayload) => {
  const updateData: Record<string, any> = {};
  if (payload.deliveryCharge !== undefined) {
    updateData.deliveryCharge = payload.deliveryCharge;
  }
  if (payload.expressDeliveryCharge !== undefined) {
    updateData.expressDeliveryCharge = payload.expressDeliveryCharge;
  }

  let filter: Record<string, any> = {};

  if (payload.scope === "inside_dhaka") {
    filter = { isInsideDhaka: true };
    // Also sync global settings
    if (payload.deliveryCharge !== undefined) {
      await ShippingSettingModel.findOneAndUpdate(
        {},
        { insideDhakaDeliveryCharge: payload.deliveryCharge, insideDhakaExpressCharge: payload.expressDeliveryCharge },
        { upsert: true }
      );
    }
  } else if (payload.scope === "outside_dhaka") {
    filter = { isInsideDhaka: { $ne: true } };
    // Also sync global settings
    if (payload.deliveryCharge !== undefined) {
      await ShippingSettingModel.findOneAndUpdate(
        {},
        { outsideDhakaDeliveryCharge: payload.deliveryCharge, outsideDhakaExpressCharge: payload.expressDeliveryCharge },
        { upsert: true }
      );
    }
  } else if (payload.scope === "division" && payload.divisionName) {
    filter = { division: payload.divisionName };
  } else if (payload.scope === "all") {
    filter = {};
  }

  const result = await DistrictModel.updateMany(filter, { $set: updateData });
  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    scope: payload.scope,
  };
};

/**
 * Get Shipping Settings
 */
const getShippingSettings = async () => {
  let settings = await ShippingSettingModel.findOne().lean();
  if (!settings) {
    settings = await ShippingSettingModel.create({
      insideDhakaDeliveryCharge: 70,
      outsideDhakaDeliveryCharge: 130,
      insideDhakaExpressCharge: 120,
      outsideDhakaExpressCharge: 180,
      freeDeliveryThreshold: 0,
      estimatedDaysInsideDhaka: "1-2 Days",
      estimatedDaysOutsideDhaka: "2-4 Days",
    });
  }
  return settings;
};

/**
 * Update Shipping Settings
 */
const updateShippingSettings = async (payload: any) => {
  const settings = await ShippingSettingModel.findOneAndUpdate({}, payload, {
    new: true,
    upsert: true,
    runValidators: true,
  });

  // If inside/outside rates were updated, sync corresponding district charges
  if (payload.insideDhakaDeliveryCharge !== undefined) {
    await DistrictModel.updateMany(
      { isInsideDhaka: true },
      {
        $set: {
          deliveryCharge: payload.insideDhakaDeliveryCharge,
          ...(payload.insideDhakaExpressCharge !== undefined && {
            expressDeliveryCharge: payload.insideDhakaExpressCharge,
          }),
        },
      }
    );
  }

  if (payload.outsideDhakaDeliveryCharge !== undefined) {
    await DistrictModel.updateMany(
      { isInsideDhaka: false },
      {
        $set: {
          deliveryCharge: payload.outsideDhakaDeliveryCharge,
          ...(payload.outsideDhakaExpressCharge !== undefined && {
            expressDeliveryCharge: payload.outsideDhakaExpressCharge,
          }),
        },
      }
    );
  }

  return settings;
};

/**
 * Calculate Delivery Charge by District name/ID
 */
const calculateDeliveryCharge = async (
  districtIdentifier: string,
  deliveryMethod: "standard" | "express" = "standard"
) => {
  let district = await DistrictModel.findOne({
    $or: [{ _id: districtIdentifier }, { name: districtIdentifier }],
  }).lean();

  if (!district) {
    // Default fallback
    return deliveryMethod === "express" ? 180 : 130;
  }

  if (deliveryMethod === "express") {
    return district.expressDeliveryCharge || district.deliveryCharge + 50;
  }
  return district.deliveryCharge;
};

/**
 * Re-seed Bangladesh Locations from scratch
 */
const triggerSeedLocations = async () => {
  const result = await seedBangladeshLocations(true);
  return result;
};

export const ShippingServices = {
  getPublicLocations,
  getAllDistricts,
  updateDistrict,
  createDistrict,
  deleteDistrict,
  getUpazilas,
  createUpazila,
  updateUpazila,
  deleteUpazila,
  bulkUpdateDistrictCharges,
  getShippingSettings,
  updateShippingSettings,
  calculateDeliveryCharge,
  triggerSeedLocations,
};
