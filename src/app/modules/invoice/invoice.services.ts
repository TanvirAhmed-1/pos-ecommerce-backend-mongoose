import { OrderModel } from "../order/order.model";
import { InvoiceModel } from "./invoice.model";
import { UserModel } from "../user/user.model";
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
    paymentMethod: order.payment?.method || "cod",
    paymentStatus: order.payment?.status || "pending",
    items: order.items,
    shippingAddress: order.shippingAddress,
  };

  const invoice = await InvoiceModel.create([invoiceData], { session });
  return invoice[0];
};

const getInvoiceByOrderId = async (orderId: string) => {
  const invoice = await InvoiceModel.findOne({ order: orderId })
    .populate("user", "name email phone")
    .populate("items.product", "name thumbnail slug sku")
    .populate("items.variant");
  return invoice;
};

const getInvoiceById = async (id: string) => {
  const invoice = await InvoiceModel.findById(id)
    .populate("user", "name email phone")
    .populate("items.product", "name thumbnail slug sku")
    .populate("items.variant")
    .populate("order");
  return invoice;
};

const getMyInvoices = async (userId: string) => {
  const invoices = await InvoiceModel.find({ user: userId })
    .populate("items.product", "name thumbnail slug sku")
    .populate("items.variant")
    .sort("-createdAt");
  return invoices;
};

interface GetAllInvoicesParams {
  page?: number;
  limit?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

const getAllInvoices = async (options: GetAllInvoicesParams = {}) => {
  const { page = 1, limit = 20, paymentStatus, paymentMethod, search, startDate, endDate } = options;

  let filter: any = {};

  if (paymentStatus && paymentStatus !== "all") {
    filter.paymentStatus = paymentStatus.toLowerCase();
  }

  if (paymentMethod && paymentMethod !== "all") {
    filter.paymentMethod = paymentMethod.toLowerCase();
  }

  if (startDate || endDate) {
    const dateFilter: any = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      dateFilter.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }
    filter.createdAt = dateFilter;
  }

  if (search) {
    const matchingUsers = await UserModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    }).select("_id");
    const userIds = matchingUsers.map((u) => u._id);

    filter.$or = [
      { invoiceNumber: { $regex: search, $options: "i" } },
      { "shippingAddress.fullName": { $regex: search, $options: "i" } },
      { "shippingAddress.phone": { $regex: search, $options: "i" } },
      { "shippingAddress.address": { $regex: search, $options: "i" } },
      { "shippingAddress.city": { $regex: search, $options: "i" } },
      { user: { $in: userIds } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const data = await InvoiceModel.find(filter)
    .populate("user", "name email phone")
    .populate("items.product", "name thumbnail slug sku")
    .populate({
      path: "items.variant",
      populate: { path: "attributes.attribute", select: "name" },
    })
    .populate("order")
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit));

  const total = await InvoiceModel.countDocuments(filter);

  // Statistics aggregated for date range
  const statMatch: any = {};
  if (startDate || endDate) {
    statMatch.createdAt = filter.createdAt;
  }

  const statPipeline: any[] = [];
  if (Object.keys(statMatch).length > 0) {
    statPipeline.push({ $match: statMatch });
  }
  statPipeline.push({
    $group: {
      _id: null,
      totalInvoices: { $sum: 1 },
      paidCount: {
        $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] },
      },
      pendingCount: {
        $sum: { $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0] },
      },
      failedCount: {
        $sum: {
          $cond: [
            { $in: ["$paymentStatus", ["failed", "cancelled"]] },
            1,
            0,
          ],
        },
      },
      totalAmount: {
        $sum: "$totalAmount",
      },
    },
  });

  const allStats = await InvoiceModel.aggregate(statPipeline);
  const stats = allStats[0] || {
    totalInvoices: 0,
    paidCount: 0,
    pendingCount: 0,
    failedCount: 0,
    totalAmount: 0,
  };

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      stats,
    },
    data,
  };
};

const updateInvoicePaymentStatus = async (
  orderId: string,
  status: "pending" | "paid" | "failed" | "cancelled",
  paymentId?: string
) => {
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

