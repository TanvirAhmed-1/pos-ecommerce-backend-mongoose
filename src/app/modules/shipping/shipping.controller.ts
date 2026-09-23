import { Request, Response } from "express";
import { status } from "http-status";
import catchAsync from "../../utils/catchAsync";
import { ShippingServices } from "./shipping.services";

const getPublicLocations = catchAsync(async (_req: Request, res: Response) => {
  const result = await ShippingServices.getPublicLocations();
  res.status(status.OK).json({
    success: true,
    message: "Public shipping locations retrieved successfully",
    data: result,
  });
});

const getAllDistricts = catchAsync(async (req: Request, res: Response) => {
  const result = await ShippingServices.getAllDistricts(req.query);
  res.status(status.OK).json({
    success: true,
    message: "Districts retrieved successfully",
    data: result,
  });
});

const createDistrict = catchAsync(async (req: Request, res: Response) => {
  const result = await ShippingServices.createDistrict(req.body);
  res.status(status.CREATED).json({
    success: true,
    message: "District created successfully",
    data: result,
  });
});

const updateDistrict = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ShippingServices.updateDistrict(id as string, req.body);
  res.status(status.OK).json({
    success: true,
    message: "District updated successfully",
    data: result,
  });
});

const deleteDistrict = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ShippingServices.deleteDistrict(id as string);
  res.status(status.OK).json({
    success: true,
    message: "District deleted successfully",
    data: result,
  });
});

const getUpazilas = catchAsync(async (req: Request, res: Response) => {
  const result = await ShippingServices.getUpazilas(req.query);
  res.status(status.OK).json({
    success: true,
    message: "Upazilas retrieved successfully",
    data: result,
  });
});

const createUpazila = catchAsync(async (req: Request, res: Response) => {
  const result = await ShippingServices.createUpazila(req.body);
  res.status(status.CREATED).json({
    success: true,
    message: "Upazila created successfully",
    data: result,
  });
});

const updateUpazila = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ShippingServices.updateUpazila(id as string, req.body);
  res.status(status.OK).json({
    success: true,
    message: "Upazila updated successfully",
    data: result,
  });
});

const deleteUpazila = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ShippingServices.deleteUpazila(id as string);
  res.status(status.OK).json({
    success: true,
    message: "Upazila deleted successfully",
    data: result,
  });
});

const bulkUpdateDistrictCharges = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ShippingServices.bulkUpdateDistrictCharges(req.body);
    res.status(status.OK).json({
      success: true,
      message: "Bulk delivery charges updated successfully",
      data: result,
    });
  }
);

const getShippingSettings = catchAsync(async (_req: Request, res: Response) => {
  const result = await ShippingServices.getShippingSettings();
  res.status(status.OK).json({
    success: true,
    message: "Shipping settings retrieved successfully",
    data: result,
  });
});

const updateShippingSettings = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ShippingServices.updateShippingSettings(req.body);
    res.status(status.OK).json({
      success: true,
      message: "Shipping settings updated successfully",
      data: result,
    });
  }
);

const calculateDeliveryCharge = catchAsync(
  async (req: Request, res: Response) => {
    const { district, deliveryMethod } = req.body;
    const charge = await ShippingServices.calculateDeliveryCharge(
      district,
      deliveryMethod
    );
    res.status(status.OK).json({
      success: true,
      message: "Delivery charge calculated successfully",
      data: { deliveryCharge: charge },
    });
  }
);

const seedLocations = catchAsync(async (_req: Request, res: Response) => {
  const result = await ShippingServices.triggerSeedLocations();
  res.status(status.OK).json({
    success: true,
    message: "Bangladesh locations seeded successfully into database",
    data: result,
  });
});

export const ShippingController = {
  getPublicLocations,
  getAllDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getUpazilas,
  createUpazila,
  updateUpazila,
  deleteUpazila,
  bulkUpdateDistrictCharges,
  getShippingSettings,
  updateShippingSettings,
  calculateDeliveryCharge,
  seedLocations,
};
