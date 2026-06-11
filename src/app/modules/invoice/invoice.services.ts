import { OrderModel } from "../order/order.model";
import { InvoiceModel } from "./invoice.model";
import { ClientSession } from "mongoose";

const createInvoiceFromOrder = async (orderId: string, session?: ClientSession) => {
  const order = await OrderModel.findById(orderId).session(session || null);
  if (!order) {
    throw new Error("Order not found to generate invoice!");
  }

  // Check if invoice already exists
  const existingInvoice = await InvoiceModel.findOne({ order: orderId }).session(session || null);
  if (existingInvoice) {
    return existingInvoice;
  }

  // Generate unique invoice number: INV-YYYYMMDD-RANDOM
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const invoiceNumber = `INV-${dateStr}-${randomSuffix}`;

  const invoiceData = {
    invoiceNumber,
    order: order._id,
    user: order.user,
    totalAmount: order.totalAmount,
    subtotal: order.subtotal || order.totalAmount,
    discount: order.discount || 0,
    vat: order.vat || 0,
    deliveryCharge: order.deliveryCharge || 0,
    paymentMethod: order.payment.method,
    paymentStatus: order.payment.status,
    items: order.items,
    shippingAddress: order.shippingAddress,
  };

  const invoice = await InvoiceModel.create([invoiceData], { session });
  return invoice[0];
};

const getInvoiceByOrderId = async (orderId: string) => {
  const invoice = await InvoiceModel.findOne({ order: orderId })
    .populate("user", "name email phone")
    .populate("items.product", "name thumbnail slug")
    .populate("items.variant");
  return invoice;
};

const getInvoiceById = async (id: string) => {
  const invoice = await InvoiceModel.findById(id)
    .populate("user", "name email phone")
    .populate("items.product", "name thumbnail slug")
    .populate("items.variant")
    .populate("order");
  return invoice;
};

const getMyInvoices = async (userId: string) => {
  const invoices = await InvoiceModel.find({ user: userId })
    .populate("items.product", "name thumbnail slug")
    .sort("-createdAt");
  return invoices;
};

const getAllInvoices = async () => {
  const invoices = await InvoiceModel.find()
    .populate("user", "name email phone")
    .populate("items.product", "name thumbnail slug")
    .sort("-createdAt");
  return invoices;
};

const updateInvoicePaymentStatus = async (orderId: string, status: "pending" | "paid" | "failed" | "cancelled", paymentId?: string) => {
  const updateData: any = { paymentStatus: status };
  if (paymentId) {
    updateData.payment = paymentId;
  }

  const invoice = await InvoiceModel.findOneAndUpdate(
    { order: orderId },
    updateData,
    { new: true }
  );
  return invoice;
};

export const InvoiceService = {
  createInvoiceFromOrder,
  getInvoiceByOrderId,
  getInvoiceById,
  getMyInvoices,
  getAllInvoices,
  updateInvoicePaymentStatus,
};
