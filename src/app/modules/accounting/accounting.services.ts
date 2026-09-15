import { AccountTransactionModel } from "./accounting.model";
import { OrderModel } from "../order/order.model";


const createTransaction = async (userId: string, payload: any) => {
  const transaction = await AccountTransactionModel.create({
    ...payload,
    createdBy: userId,
    date: payload.date ? new Date(payload.date) : new Date(),
  });
  return transaction;
};

interface GetAllTransactionsParams {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  account?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

const getAllTransactions = async (query: GetAllTransactionsParams) => {
  const {
    page = 1,
    limit = 20,
    type,
    category,
    account,
    startDate,
    endDate,
    searchTerm,
  } = query;

  let filter: any = {};

  if (type && type !== "all") {
    filter.type = type.toLowerCase();
  }

  if (category && category !== "all") {
    filter.category = category;
  }

  if (account && account !== "all") {
    filter.account = account;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (searchTerm) {
    filter.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { reference: { $regex: searchTerm, $options: "i" } },
      { notes: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
      { account: { $regex: searchTerm, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const data = await AccountTransactionModel.find(filter)
    .populate("createdBy", "name email")
    .sort("-date -createdAt")
    .skip(skip)
    .limit(Number(limit));

  const total = await AccountTransactionModel.countDocuments(filter);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
    data,
  };
};

const getAccountingSummary = async (filterQuery: { startDate?: string; endDate?: string } = {}) => {
  const { startDate, endDate } = filterQuery;

  let orderMatch: any = { orderStatus: { $ne: "cancelled" } };
  let txMatch: any = {};
  let expenseTxMatch: any = { type: "expense" };

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
    orderMatch.createdAt = dateFilter;
    txMatch.date = dateFilter;
    expenseTxMatch.date = dateFilter;
  }

  // 1. Order Sales Aggregation (Delivered / Paid orders)
  const orderStats = await OrderModel.aggregate([
    {
      $match: orderMatch,
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
        totalSubtotal: { $sum: { $ifNull: ["$subtotal", "$totalAmount"] } },
        totalDiscounts: { $sum: { $ifNull: ["$discount", 0] } },
        totalVat: { $sum: { $ifNull: ["$vat", 0] } },
        totalDeliveryCharge: { $sum: { $ifNull: ["$deliveryCharge", 0] } },
        paidSales: {
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
        codPending: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $in: ["$payment.method", ["cod", "COD"]] },
                  { $ne: ["$orderStatus", "delivered"] },
                  { $ne: ["$payment.status", "paid"] },
                ],
              },
              "$totalAmount",
              0,
            ],
          },
        },
        cashSales: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $in: ["$payment.method", ["cash", "CASH", "pos", "POS"]] },
                  { $eq: ["$payment.status", "paid"] },
                ],
              },
              "$totalAmount",
              0,
            ],
          },
        },
        bkashSales: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $in: ["$payment.method", ["bkash", "BKASH"]] },
                  { $eq: ["$payment.status", "paid"] },
                ],
              },
              "$totalAmount",
              0,
            ],
          },
        },
        nagadSales: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $in: ["$payment.method", ["nagad", "NAGAD"]] },
                  { $eq: ["$payment.status", "paid"] },
                ],
              },
              "$totalAmount",
              0,
            ],
          },
        },
        cardSales: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $in: [
                      "$payment.method",
                      ["card", "CARD", "online_payment", "bank_transfer"],
                    ],
                  },
                  { $eq: ["$payment.status", "paid"] },
                ],
              },
              "$totalAmount",
              0,
            ],
          },
        },
      },
    },
  ]);

  const sales = orderStats[0] || {
    totalSales: 0,
    totalSubtotal: 0,
    totalDiscounts: 0,
    totalVat: 0,
    totalDeliveryCharge: 0,
    paidSales: 0,
    codPending: 0,
    cashSales: 0,
    bkashSales: 0,
    nagadSales: 0,
    cardSales: 0,
  };

  // 2. Transactions Aggregation (Income & Expenses)
  const txAggStages: any[] = [];
  if (Object.keys(txMatch).length > 0) {
    txAggStages.push({ $match: txMatch });
  }
  txAggStages.push({
    $group: {
      _id: "$type",
      totalAmount: { $sum: "$amount" },
    },
  });
  const transactionTotals = await AccountTransactionModel.aggregate(txAggStages);

  let manualIncome = 0;
  let totalExpenses = 0;

  transactionTotals.forEach((t) => {
    if (t._id === "income") manualIncome = t.totalAmount;
    if (t._id === "expense") totalExpenses = t.totalAmount;
  });

  // 3. Category-wise Expense Breakdown
  const expenseCategories = await AccountTransactionModel.aggregate([
    {
      $match: expenseTxMatch,
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  // 4. Account-wise Transaction Aggregations (for wallet calculations)
  const accAggStages: any[] = [];
  if (Object.keys(txMatch).length > 0) {
    accAggStages.push({ $match: txMatch });
  }
  accAggStages.push({
    $group: {
      _id: { account: "$account", type: "$type" },
      total: { $sum: "$amount" },
    },
  });
  const accountStats = await AccountTransactionModel.aggregate(accAggStages);


  const accountBalances: Record<string, { income: number; expense: number }> = {};
  accountStats.forEach((st) => {
    const acc = st._id.account;
    const type = st._id.type;
    if (!accountBalances[acc]) {
      accountBalances[acc] = { income: 0, expense: 0 };
    }
    if (type === "income") accountBalances[acc].income += st.total;
    if (type === "expense") accountBalances[acc].expense += st.total;
  });

  // Combine Order Sales into Wallets
  const wallets = [
    {
      name: "Cash in Hand",
      type: "cash",
      balance:
        sales.cashSales +
        (accountBalances["Cash in Hand"]?.income || 0) -
        (accountBalances["Cash in Hand"]?.expense || 0),
    },
    {
      name: "bKash Merchant",
      type: "mfs",
      balance:
        sales.bkashSales +
        (accountBalances["bKash Merchant"]?.income || 0) -
        (accountBalances["bKash Merchant"]?.expense || 0),
    },
    {
      name: "Nagad Merchant",
      type: "mfs",
      balance:
        sales.nagadSales +
        (accountBalances["Nagad Merchant"]?.income || 0) -
        (accountBalances["Nagad Merchant"]?.expense || 0),
    },
    {
      name: "Bank Account (BRAC)",
      type: "bank",
      balance:
        sales.cardSales +
        (accountBalances["Bank Account (BRAC)"]?.income || 0) -
        (accountBalances["Bank Account (BRAC)"]?.expense || 0),
    },
    {
      name: "Courier COD Receivables",
      type: "receivable",
      balance: sales.codPending,
    },
  ];

  const totalWalletBalance = wallets.reduce((acc, w) => acc + (w.balance > 0 ? w.balance : 0), 0);

  // 5. Total Revenue & Net Profit Calculation
  const totalRevenue = sales.paidSales + manualIncome;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin =
    totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(1)) : 0;

  // 6. Monthly Cash Flow (Last 6 Months)
  const monthlyFlow = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const monthName = d.toLocaleString("default", { month: "short" });

    // Orders revenue for this month
    const mOrders = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          orderStatus: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Expenses for this month
    const mExpenses = await AccountTransactionModel.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
          type: "expense",
        },
      },
      {
        $group: {
          _id: null,
          expense: { $sum: "$amount" },
        },
      },
    ]);

    const rev = mOrders[0]?.revenue || 0;
    const exp = mExpenses[0]?.expense || 0;

    monthlyFlow.push({
      month: monthName,
      revenue: rev,
      expense: exp,
      profit: rev - exp,
    });
  }

  // 7. Recent Transactions
  const recentTransactions = await AccountTransactionModel.find({})
    .sort("-date -createdAt")
    .limit(8)
    .populate("createdBy", "name email");

  return {
    overview: {
      totalRevenue,
      grossSales: sales.totalSales,
      paidSales: sales.paidSales,
      manualIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      totalDiscounts: sales.totalDiscounts,
      totalVat: sales.totalVat,
      totalDeliveryCharge: sales.totalDeliveryCharge,
      totalWalletBalance,
    },
    wallets,
    expenseCategories,
    monthlyFlow,
    recentTransactions,
  };
};

const updateTransaction = async (id: string, payload: any) => {
  const result = await AccountTransactionModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new Error("Transaction record not found!");
  }
  return result;
};

const deleteTransaction = async (id: string) => {
  const result = await AccountTransactionModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error("Transaction record not found!");
  }
  return result;
};

export const AccountingService = {
  createTransaction,
  getAllTransactions,
  getAccountingSummary,
  updateTransaction,
  deleteTransaction,
};
