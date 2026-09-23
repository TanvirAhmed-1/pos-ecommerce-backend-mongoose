import mongoose from "mongoose";
import { CartModel } from "../cart/cart.model";
import { OrderModel } from "./order.model";
import { VariantModel } from "../variant/variant.model";
import { ProductModel } from "../product/product.model";
import { PaymentModel } from "../payment/payment.model";
import { InvoiceService } from "../invoice/invoice.services";
import { InvoiceModel } from "../invoice/invoice.model";
import { UserModel } from "../user/user.model";
import { AddressModel } from "../address/address.model";
import { DistrictModel, ShippingSettingModel } from "../shipping/shipping.model";
import { CouponModel } from "../coupon/coupon.model";

const updateProductTotalStock = async (
  productId: string | mongoose.Types.ObjectId,
  session?: mongoose.ClientSession
) => {
  try {
    const totalStockData = await VariantModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId.toString()),
          isActive: true,
        },
      },
      { $group: { _id: "$product", total: { $sum: "$stock" } } },
    ]);
    const totalStock = totalStockData.length > 0 ? totalStockData[0].total : 0;
    await ProductModel.findByIdAndUpdate(
      productId,
      { totalStock },
      { session: session || null }
    );
  } catch (err) {
    console.error("Failed to update product totalStock:", err);
  }
};

const createOrderIntoDB = async (userId: string, payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await CartModel.findOne({ user: userId }).session(session);
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty!");
    }

    // 1. Resolve final shipping address and address ID reference
    let finalShippingAddress: any = null;
    let addressRef: any = null;

    if (
      typeof payload.shippingAddress === "string" &&
      mongoose.Types.ObjectId.isValid(payload.shippingAddress)
    ) {
      const addressDoc = await AddressModel.findById(payload.shippingAddress).session(session);
      if (addressDoc) {
        addressRef = addressDoc._id;
        finalShippingAddress = {
          fullName: addressDoc.fullName,
          phone: addressDoc.phone,
          address: addressDoc.address,
          division: addressDoc.division,
          district: addressDoc.district,
          upazila: addressDoc.upazila,
          city: addressDoc.district || addressDoc.division || "Dhaka",
        };
      }
    } else if (payload.shippingAddress && typeof payload.shippingAddress === "object") {
      finalShippingAddress = {
        fullName: payload.shippingAddress.fullName || "",
        phone: payload.shippingAddress.phone || "",
        address: payload.shippingAddress.address || "",
        division: payload.shippingAddress.division || "Dhaka",
        district: payload.shippingAddress.district || "Dhaka",
        upazila: payload.shippingAddress.upazila || "",
        city:
          payload.shippingAddress.city ||
          payload.shippingAddress.district ||
          payload.shippingAddress.division ||
          "Dhaka",
      };
      if (payload.address && mongoose.Types.ObjectId.isValid(payload.address)) {
        addressRef = payload.address;
      }
    }

    if (
      !finalShippingAddress ||
      !finalShippingAddress.fullName ||
      !finalShippingAddress.phone ||
      !finalShippingAddress.address
    ) {
      if (payload.address && mongoose.Types.ObjectId.isValid(payload.address)) {
        const addressDoc = await AddressModel.findById(payload.address).session(session);
        if (addressDoc) {
          addressRef = addressDoc._id;
          finalShippingAddress = {
            fullName: addressDoc.fullName,
            phone: addressDoc.phone,
            address: addressDoc.address,
            division: addressDoc.division,
            district: addressDoc.district,
            upazila: addressDoc.upazila,
            city: addressDoc.district || addressDoc.division || "Dhaka",
          };
        }
      }
    }

    if (
      !finalShippingAddress ||
      !finalShippingAddress.fullName ||
      !finalShippingAddress.phone ||
      !finalShippingAddress.address
    ) {
      const user = await UserModel.findById(userId).session(session);
      finalShippingAddress = {
        fullName: finalShippingAddress?.fullName || user?.name || "Customer",
        phone: finalShippingAddress?.phone || user?.phone || "01700000000",
        address: finalShippingAddress?.address || "Delivery Address",
        division: finalShippingAddress?.division || "Dhaka",
        district: finalShippingAddress?.district || "Dhaka",
        upazila: finalShippingAddress?.upazila || "",
        city: finalShippingAddress?.city || finalShippingAddress?.district || "Dhaka",
      };
    }

    // 2. Recalculate Subtotal from Live Product/Variant Data in Database
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of cart.items) {
      let unitPrice = item.price;
      if (item.variant) {
        const variant = await VariantModel.findById(item.variant).session(session);
        if (variant && typeof variant.price === "number") {
          unitPrice = variant.price;
        }
      } else if (item.product) {
        const product = await ProductModel.findById(item.product).session(session);
        if (product) {
          unitPrice =
            product.salePrice && product.salePrice > 0
              ? product.salePrice
              : product.basePrice || item.price;
        }
      }

      calculatedSubtotal += unitPrice * item.quantity;
      validatedItems.push({
        product: item.product,
        variant: item.variant || undefined,
        quantity: item.quantity,
        price: unitPrice,
      });
    }

    // 3. Calculate Delivery Charge from Database based on Shipping District
    const targetDistrictName = (finalShippingAddress.district || "Dhaka").trim();
    const districtDoc = await DistrictModel.findOne({
      name: new RegExp(`^${targetDistrictName}$`, "i"),
    }).session(session);

    const settingsDoc = await ShippingSettingModel.findOne().session(session);

    const isInsideDhaka = districtDoc
      ? districtDoc.isInsideDhaka
      : targetDistrictName.toLowerCase() === "dhaka";

    const isExpress = payload.deliveryMethod === "express";

    let calculatedDeliveryCharge = 0;
    if (isInsideDhaka) {
      calculatedDeliveryCharge = isExpress
        ? districtDoc?.expressDeliveryCharge || settingsDoc?.insideDhakaExpressCharge || 120
        : districtDoc?.deliveryCharge || settingsDoc?.insideDhakaDeliveryCharge || 70;
    } else {
      calculatedDeliveryCharge = isExpress
        ? districtDoc?.expressDeliveryCharge || settingsDoc?.outsideDhakaExpressCharge || 180
        : districtDoc?.deliveryCharge || settingsDoc?.outsideDhakaDeliveryCharge || 130;
    }

    // Check Free Delivery Threshold
    if (
      settingsDoc?.freeDeliveryThreshold &&
      settingsDoc.freeDeliveryThreshold > 0 &&
      calculatedSubtotal >= settingsDoc.freeDeliveryThreshold
    ) {
      calculatedDeliveryCharge = 0;
    }

    // 4. Calculate Discount (e.g. Coupon or Promotion)
    let calculatedDiscount = 0;
    if (payload.couponCode) {
      const coupon = await CouponModel.findOne({
        code: payload.couponCode.toUpperCase().trim(),
      }).session(session);

      if (coupon) {
        if (coupon.type === "percentage") {
          calculatedDiscount = Math.round((calculatedSubtotal * coupon.value) / 100);
        } else if (coupon.type === "flat") {
          calculatedDiscount = coupon.value;
        }
      }
    } else if (payload.discount && typeof payload.discount === "number" && payload.discount > 0) {
      calculatedDiscount = Math.min(payload.discount, calculatedSubtotal);
    }

    calculatedDiscount = Math.min(calculatedDiscount, calculatedSubtotal);

    // 5. Final Total Amount
    const totalAmount = Math.max(0, calculatedSubtotal - calculatedDiscount + calculatedDeliveryCharge);

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = payload.orderNumber || `ORD-${dateStr}-${randomSuffix}`;

    const orderData = {
      orderNumber,
      user: userId,
      address: addressRef,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      vat: 0,
      deliveryCharge: calculatedDeliveryCharge,
      totalAmount,
      shippingAddress: finalShippingAddress,
      payment: {
        method: payload.paymentMethod || "cod",
        status: payload.paymentMethod === "cod" ? "pending" : "pending",
        transactionId: payload.transactionId,
        date: new Date(),
      },
      deliveryType: payload.deliveryType || "home_delivery",
      orderStatus: "pending",
      notes: payload.notes,
      source: "web",
    };

    const order = await OrderModel.create([orderData], { session });

    // Generate Invoice automatically for the order
    await InvoiceService.createInvoiceFromOrder(order[0]._id.toString(), session);

    // If COD, deduct variant stock and sync parent total stock
    if (payload.paymentMethod === "cod") {
      for (const item of validatedItems) {
        if (item.variant) {
          await VariantModel.findByIdAndUpdate(
            item.variant,
            { $inc: { stock: -item.quantity } },
            { session }
          );
        }
        if (item.product) {
          await updateProductTotalStock(item.product.toString(), session);
        }
      }
      // Empty cart
      await CartModel.findOneAndUpdate(
        { user: userId },
        { items: [], totalAmount: 0, totalItems: 0 },
        { session }
      );
    }

    const populatedOrder = await OrderModel.findById(order[0]._id)
      .populate("items.product", "name thumbnail slug sku basePrice salePrice")
      .populate("items.variant")
      .populate("address")
      .session(session);

    await session.commitTransaction();
    session.endSession();
    return populatedOrder || order[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

const createAdminOrder = async (adminId: string, payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      user,
      customerInfo,
      items,
      shippingAddress,
      subtotal,
      discount = 0,
      vat = 0,
      deliveryCharge = 0,
      totalAmount,
      paymentMethod = "cash",
      paymentStatus = "paid",
      orderStatus = "processing",
      deliveryType = "home_delivery",
      notes,
      source = "pos",
    } = payload;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Order must have at least one product item!");
    }

    const finalShippingAddress = shippingAddress || {
      fullName: customerInfo?.fullName || "Walk-in Customer",
      phone: customerInfo?.phone || "01700000000",
      address: customerInfo?.address || "Store Outlet",
      city: customerInfo?.city || customerInfo?.district || "Dhaka",
      district: customerInfo?.district || "Dhaka",
      upazila: customerInfo?.upazila || "",
      division: customerInfo?.division || "Dhaka",
    };

    const calculatedSubtotal =
      subtotal ||
      items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const calculatedTotal =
      totalAmount ||
      calculatedSubtotal - (discount || 0) + (vat || 0) + (deliveryCharge || 0);

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;
    const transactionId = `TXN-${dateStr}-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderData = {
      orderNumber,
      user: user || undefined,
      items: items.map((it: any) => ({
        product: it.product,
        variant: it.variant || undefined,
        quantity: it.quantity,
        price: it.price,
      })),
      subtotal: calculatedSubtotal,
      discount,
      vat,
      deliveryCharge,
      totalAmount: calculatedTotal,
      shippingAddress: finalShippingAddress,
      payment: {
        method: paymentMethod,
        status: paymentStatus,
        transactionId,
        date: new Date(),
      },
      paymentStatus,
      orderStatus,
      deliveryType,
      notes,
      source,
    };

    const order = await OrderModel.create([orderData], { session });
    const createdOrder = order[0];

    // Deduct stock for each variant & sync parent product totalStock
    for (const item of items) {
      if (item.variant) {
        await VariantModel.findByIdAndUpdate(
          item.variant,
          { $inc: { stock: -item.quantity } },
          { session }
        );
      }
      if (item.product) {
        await updateProductTotalStock(item.product, session);
      }
    }

    // Auto-generate invoice
    const invoice = await InvoiceService.createInvoiceFromOrder(
      createdOrder._id.toString(),
      session
    );

    // If paid, create Payment document
    if (paymentStatus === "paid") {
      const pGateway =
        paymentMethod.toUpperCase() === "COD" ? "CASH" : paymentMethod.toUpperCase();
      await PaymentModel.create(
        [
          {
            transactionId,
            order: createdOrder._id,
            user: user || (adminId ? new mongoose.Types.ObjectId(adminId) : undefined),
            amount: calculatedTotal,
            currency: "BDT",
            paymentGateway: pGateway,
            status: "SUCCESS",
            paymentData: {
              source,
              receivedBy: adminId,
              notes: notes || "POS/Admin direct sale",
            },
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    const populatedOrder = await OrderModel.findById(createdOrder._id)
      .populate("user", "name email phone role")
      .populate(
        "items.product",
        "name thumbnail slug basePrice salePrice totalStock sku barcode"
      )
      .populate({
        path: "items.variant",
        populate: { path: "attributes.attribute", select: "name" },
      });

    return {
      order: populatedOrder,
      invoice,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

const getMyOrdersFromDB = async (userId: string) => {
  return await OrderModel.find({ user: userId })
    .populate("items.product", "name thumbnail slug")
    .sort("-createdAt");
};

const getSingleOrderFromDB = async (orderId: string, userId: string) => {
  return await OrderModel.findOne({ _id: orderId, user: userId })
    .populate("items.product")
    .populate("items.variant");
};

const updateOrderStatusInDB = async (
  orderId: string,
  status?: string,
  paymentStatus?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await OrderModel.findById(orderId).session(session);
    if (!order) {
      throw new Error("Order not found!");
    }

    // If already delivered, cannot cancel
    if (status === "cancelled" && order.orderStatus === "delivered") {
      throw new Error("Delivered order cannot be cancelled!");
    }

    // If cancelled, restock variants and sync parent product totalStock
    if (status === "cancelled" && order.orderStatus !== "cancelled") {
      for (const item of order.items) {
        if (item.variant) {
          await VariantModel.findByIdAndUpdate(
            item.variant,
            { $inc: { stock: item.quantity } },
            { session },
          );
        }
        if (item.product) {
          await updateProductTotalStock(item.product.toString(), session);
        }
      }
    }

    const updateData: any = {};
    if (status) {
      updateData.orderStatus = status;
    }
    if (paymentStatus) {
      updateData["payment.status"] = paymentStatus;
      updateData.paymentStatus = paymentStatus;
    }

    const result = await OrderModel.findByIdAndUpdate(orderId, updateData, {
      new: true,
      session,
    });

    if (status === "cancelled" || paymentStatus === "cancelled") {
      await InvoiceService.updateInvoicePaymentStatus(orderId, "cancelled");
    } else if (paymentStatus === "paid") {
      await InvoiceService.updateInvoicePaymentStatus(orderId, "paid");
    }

    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

const getAllOrdersFromDB = async (query: Record<string, any>) => {
  const { page = 1, limit = 20, searchTerm, status, startDate, endDate } = query;

  let filter: any = {};

  if (status && status !== "All") {
    filter.orderStatus = status.toLowerCase();
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

  if (searchTerm) {
    const matchingUsers = await UserModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ],
    }).select("_id");

    const userIds = matchingUsers.map((u) => u._id);

    filter.$or = [
      { orderNumber: { $regex: searchTerm, $options: "i" } },
      { user: { $in: userIds } },
      { "shippingAddress.fullName": { $regex: searchTerm, $options: "i" } },
      { "shippingAddress.phone": { $regex: searchTerm, $options: "i" } },
      { "shippingAddress.address": { $regex: searchTerm, $options: "i" } },
      { "shippingAddress.city": { $regex: searchTerm, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const orderQuery = OrderModel.find(filter)
    .populate("user", "name email phone role")
    .populate(
      "items.product",
      "name thumbnail slug basePrice salePrice totalStock hasVariants sku productCode barcode"
    )
    .populate({
      path: "items.variant",
      populate: { path: "attributes.attribute", select: "name" },
    })
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit));

  const result = await orderQuery;
  const total = await OrderModel.countDocuments(filter);

  // Global & Date-filtered order statistics aggregation
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
      totalOrders: { $sum: 1 },
      pendingOrders: {
        $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] },
      },
      processingOrders: {
        $sum: { $cond: [{ $eq: ["$orderStatus", "processing"] }, 1, 0] },
      },
      deliveredOrders: {
        $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
      },
      cancelledOrders: {
        $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] },
      },
      totalSales: {
        $sum: {
          $cond: [
            {
              $or: [
                { $eq: ["$orderStatus", "delivered"] },
                { $eq: ["$payment.status", "paid"] },
              ],
            },
            "$totalAmount",
            0,
          ],
        },
      },
    },
  });

  const allStats = await OrderModel.aggregate(statPipeline);

  const stats = allStats[0] || {
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalSales: 0,
  };

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
      stats,
    },
    data: result,
  };
};


const updateAdminOrderInDB = async (orderId: string, _adminId: string, payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingOrder = await OrderModel.findById(orderId).session(session);
    if (!existingOrder) {
      throw new Error("Order not found!");
    }

    const {
      shippingAddress,
      alternativePhone,
      items,
      subtotal,
      discount,
      deliveryCharge,
      vat,
      totalAmount,
      orderStatus,
      paymentStatus,
      paymentMethod,
      courier,
      notes,
      callStatus,
      callNote,
      agentName,
    } = payload;

    // 1. Stock Adjustment if items list is provided and changed
    if (items && Array.isArray(items) && items.length > 0) {
      // Step A: Restock previous items if order was active (not cancelled)
      if (existingOrder.orderStatus !== "cancelled") {
        for (const oldItem of existingOrder.items) {
          if (oldItem.variant) {
            await VariantModel.findByIdAndUpdate(
              oldItem.variant,
              { $inc: { stock: oldItem.quantity } },
              { session }
            );
          }
          if (oldItem.product) {
            await updateProductTotalStock(oldItem.product.toString(), session);
          }
        }
      }

      // Step B: Deduct stock for updated items (unless target status is cancelled)
      const targetStatus = orderStatus || existingOrder.orderStatus;
      if (targetStatus !== "cancelled") {
        for (const newItem of items) {
          const variantId = newItem.variant?._id || newItem.variant;
          const productId = newItem.product?._id || newItem.product;

          if (variantId) {
            const v = await VariantModel.findById(variantId).session(session);
            if (!v || v.stock < newItem.quantity) {
              throw new Error(
                `Insufficient stock for variant (${v?.sku || "Variant"})! Available stock: ${v?.stock || 0}`
              );
            }
            await VariantModel.findByIdAndUpdate(
              variantId,
              { $inc: { stock: -newItem.quantity } },
              { session }
            );
          }
          if (productId) {
            await updateProductTotalStock(productId.toString(), session);
          }
        }
      }
    }

    // 2. Prepare Update Object
    const updateData: any = {};
    if (shippingAddress) {
      updateData.shippingAddress = shippingAddress;
    }
    if (alternativePhone !== undefined) {
      updateData.alternativePhone = alternativePhone;
    }
    if (items && Array.isArray(items) && items.length > 0) {
      updateData.items = items.map((it: any) => ({
        product: it.product?._id || it.product,
        variant: it.variant?._id || it.variant || undefined,
        quantity: Number(it.quantity || 1),
        price: Number(it.price || 0),
      }));
    }
    if (subtotal !== undefined) updateData.subtotal = Number(subtotal);
    if (discount !== undefined) updateData.discount = Number(discount);
    if (deliveryCharge !== undefined) updateData.deliveryCharge = Number(deliveryCharge);
    if (vat !== undefined) updateData.vat = Number(vat);
    if (totalAmount !== undefined) updateData.totalAmount = Number(totalAmount);
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) {
      updateData["payment.status"] = paymentStatus;
      updateData.paymentStatus = paymentStatus;
    }
    if (paymentMethod) {
      updateData["payment.method"] = paymentMethod;
    }
    if (courier) updateData.courier = courier;
    if (notes !== undefined) updateData.notes = notes;

    // Tele-Call confirmation logging
    if (callStatus) {
      updateData.callStatus = callStatus;
      if (callStatus === "confirmed") {
        if (!orderStatus || orderStatus === "pending") {
          updateData.orderStatus = "processing";
        }
        updateData.confirmedBy = {
          name: agentName || "Admin Agent",
          date: new Date(),
        };
      }
    }

    if (callStatus || callNote) {
      const newLog = {
        callStatus: callStatus || existingOrder.callStatus || "pending",
        note: callNote || "",
        agentName: agentName || "Admin Agent",
        date: new Date(),
      };
      updateData.$push = { callLogs: newLog };
      updateData.$inc = { callAttempts: 1 };
    }

    const updated = await OrderModel.findByIdAndUpdate(orderId, updateData, {
      new: true,
      session,
    })
      .populate("user", "name email phone role")
      .populate("items.product")
      .populate("items.variant");

    // 3. Sync Invoice if exists
    try {
      if (totalAmount !== undefined || paymentStatus !== undefined || shippingAddress) {
        await InvoiceModel.findOneAndUpdate(
          { order: orderId },
          {
            totalAmount: updated?.totalAmount,
            status: paymentStatus || updated?.payment?.status,
            customerName: updated?.shippingAddress?.fullName,
            customerPhone: updated?.shippingAddress?.phone,
            customerAddress: updated?.shippingAddress?.address,
          },
          { session }
        );
      }
    } catch (invErr) {
      console.log("Invoice sync warning:", invErr);
    }

    await session.commitTransaction();
    session.endSession();
    return updated;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

const deleteOrderFromDB = async (orderId: string) => {
  const result = await OrderModel.findByIdAndDelete(orderId);
  if (!result) {
    throw new Error("Order not found!");
  }
  return result;
};

export const OrderService = {
  createOrderIntoDB,
  createAdminOrder,
  getMyOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderStatusInDB,
  updateAdminOrderInDB,
  getAllOrdersFromDB,
  deleteOrderFromDB,
  updateProductTotalStock,
};

