import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { InvoiceService } from "./invoice.services";
import AppError from "../../errors/AppError";

const generateInvoice = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.body;
  if (!orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  const invoice = await InvoiceService.createInvoiceFromOrder(orderId as string);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Invoice generated successfully",
    data: invoice,
  });
});

const getInvoiceByOrderId = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId as string;
  const invoice = await InvoiceService.getInvoiceByOrderId(orderId);

  if (!invoice) {
    throw new AppError(httpStatus.NOT_FOUND, "Invoice not found for this order");
  }

  // Security check: only allow order owner or admin/superadmin to view
  const user = req.user;
  const invoiceUserId = invoice.user && (invoice.user as any)._id ? (invoice.user as any)._id.toString() : invoice.user.toString();
  if (user.role !== "admin" && user.role !== "superadmin" && invoiceUserId !== user.id) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to view this invoice");
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Invoice retrieved successfully",
    data: invoice,
  });
});

const getInvoiceById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const invoice = await InvoiceService.getInvoiceById(id);

  if (!invoice) {
    throw new AppError(httpStatus.NOT_FOUND, "Invoice not found");
  }

  // Security check: only allow invoice owner or admin/superadmin to view
  const user = req.user;
  const invoiceUserId = invoice.user && (invoice.user as any)._id ? (invoice.user as any)._id.toString() : invoice.user.toString();
  if (user.role !== "admin" && user.role !== "superadmin" && invoiceUserId !== user.id) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to view this invoice");
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Invoice retrieved successfully",
    data: invoice,
  });
});

const getMyInvoices = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const invoices = await InvoiceService.getMyInvoices(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Invoices retrieved successfully",
    data: invoices,
  });
});

const getAllInvoices = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, paymentStatus, paymentMethod, search } = req.query;
  const result = await InvoiceService.getAllInvoices({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
    paymentStatus: paymentStatus as string,
    paymentMethod: paymentMethod as string,
    search: search as string,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "All invoices retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const InvoiceController = {
  generateInvoice,
  getInvoiceByOrderId,
  getInvoiceById,
  getMyInvoices,
  getAllInvoices,
};
