import { OrderModel } from "../order/order.model";
import { ProductModel } from "../product/product.model";
import { UserModel } from "../user/user.model";

const getOverviewDataFromDB = async () => {
  // 1. Get totals
  const totalOrders = await OrderModel.countDocuments({});
  const totalProducts = await ProductModel.countDocuments({});
  const totalUsers = await UserModel.countDocuments({});

  // 2. Sum revenue
  const revenueAggregation = await OrderModel.aggregate([
    {
      $match: {
        orderStatus: { $ne: "cancelled" }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" }
      }
    }
  ]);

  const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

  // 3. Order status breakdown
  const statusStats = await OrderModel.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 }
      }
    }
  ]);

  const statusMap: Record<string, number> = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };

  statusStats.forEach((stat) => {
    if (stat._id) {
      statusMap[stat._id.toLowerCase()] = stat.count;
    }
  });

  // 4. Monthly sales aggregation for current year
  const currentYear = new Date().getFullYear();
  const monthlySales = await OrderModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`)
        },
        orderStatus: { $ne: "cancelled" }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);

  // Construct 12 months array
  const monthlyRevenueArray = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    revenue: 0,
    orders: 0
  }));

  monthlySales.forEach((item) => {
    const idx = item._id - 1;
    if (idx >= 0 && idx < 12) {
      monthlyRevenueArray[idx].revenue = item.revenue;
      monthlyRevenueArray[idx].orders = item.orders;
    }
  });

  // 5. Recent orders
  const recentOrders = await OrderModel.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name email phone");

  return {
    totals: {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers
    },
    statusBreakdown: statusMap,
    monthlySales: monthlyRevenueArray,
    recentOrders
  };
};

const getAnalyticsDataFromDB = async () => {
  // Compute hourly heatmap over the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const heatmapAgg = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $project: {
        dayOfWeek: { $dayOfWeek: "$createdAt" }, // 1 (Sunday) to 7 (Saturday)
        hour: { $hour: "$createdAt" } // 0 to 23
      }
    },
    {
      $group: {
        _id: { dayOfWeek: "$dayOfWeek", hour: "$hour" },
        count: { $sum: 1 }
      }
    }
  ]);

  // Map 1-7 (Sunday-Saturday) to string labels
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const heatmapData = daysOfWeek.map((day, dIdx) => {
    // MongoDB dayOfWeek index is 1-indexed starting Sunday
    const mongoDayNum = dIdx + 1;
    return {
      day,
      hours: Array.from({ length: 24 }, (_, hourNum) => {
        const match = heatmapAgg.find(
          (item) => item._id.dayOfWeek === mongoDayNum && item._id.hour === hourNum
        );
        return {
          hour: hourNum,
          count: match ? match.count : 0
        };
      })
    };
  });

  // Product sales counts breakdown
  const topProductsAgg = await OrderModel.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSales: { $sum: "$items.quantity" },
        totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
      }
    },
    { $sort: { totalSales: -1 } },
    { $limit: 5 }
  ]);

  // Populate product details manually to prevent schema compilation issues
  const topProducts = await Promise.all(
    topProductsAgg.map(async (item) => {
      const prod = await ProductModel.findById(item._id).select("name thumbnail sku totalStock");
      return {
        id: item._id,
        name: prod?.name || "Product Item",
        sku: prod?.sku || "N/A",
        thumbnail: prod?.thumbnail || "",
        stock: prod?.totalStock || 0,
        sales: item.totalSales,
        revenue: item.totalRevenue
      };
    })
  );

  return {
    heatmap: heatmapData,
    topProducts
  };
};

export const DashboardServices = {
  getOverviewDataFromDB,
  getAnalyticsDataFromDB
};
