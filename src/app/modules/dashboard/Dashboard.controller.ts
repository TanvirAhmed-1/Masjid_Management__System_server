import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { DashboardServices } from "./Dashboard.services";
import { getCache, setCache } from "../../utils/cache.util";

// ─── helper ────────────────────────────────────────────────────────────────
/**
 * Parses query params into a typed DateFilter object.
 *
 * Accepted query params:
 *   mode   = "date" | "month" | "year"   (default: "month")
 *   date   = "YYYY-MM-DD"                (when mode=date)
 *   month  = 1-12                         (when mode=month)
 *   year   = e.g. 2026                   (when mode=month or year)
 */
function parseFilter(query: Record<string, any>) {
  const mode = (query.mode as string) || "month";
  const now  = new Date();

  return {
    mode: mode as "date" | "month" | "year",
    date:  query.date   as string | undefined,
    month: query.month  ? Number(query.month)  : mode === "month" ? now.getMonth() + 1 : undefined,
    year:  query.year   ? Number(query.year)   : now.getFullYear(),
  };
}

function mosqueGuard(req: any, res: any): string | null {
  const mosqueId = req.user?.mosqueId;
  if (!mosqueId) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Mosque not found in token",
    });
    return null;
  }
  return mosqueId;
}

// ─── controllers ───────────────────────────────────────────────────────────

/**
 * GET /dashboard/stats
 * Query: mode, date, month, year
 *
 * Returns financial overview (revenue, expense, net) for the given period.
 */
const getDashboardStats = catchAsync(async (req, res) => {
  const mosqueId = mosqueGuard(req, res);
  if (!mosqueId) return;

  const filter = parseFilter(req.query as any);
  const cacheKey = `dashboard:stats:${mosqueId}:${filter.mode}:${filter.date || "none"}:${filter.month || "none"}:${filter.year || "none"}`;

  try {
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Dashboard statistics fetched successfully (from Cache)",
        data: cachedResult,
      });
    }
  } catch (error) {
    console.error("Redis error fetching dashboard stats cache:", error);
  }

  const result = await DashboardServices.getDashboardStatsDB(mosqueId, filter);

  try {
    await setCache(cacheKey, result, 3600);
  } catch (error) {
    console.error("Redis error setting dashboard stats cache:", error);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Dashboard statistics fetched successfully",
    data: result,
  });
});

/**
 * GET /dashboard/collections
 * Query: mode, date, month, year, type (friday | member | other | all)
 *
 * Returns raw collection records filtered by date period.
 */
const getFilteredCollections = catchAsync(async (req, res) => {
  const mosqueId = mosqueGuard(req, res);
  if (!mosqueId) return;

  const filter = parseFilter(req.query as any);
  const type   = (req.query.type as string) || "all";

  if (!["friday", "member", "other", "all"].includes(type)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Invalid type. Use: friday | member | other | all",
    });
  }

  const result = await DashboardServices.getFilteredCollectionsDB(
    mosqueId,
    filter,
    type as any
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Collections fetched successfully",
    data: result,
  });
});

/**
 * GET /dashboard/expenses
 * Query: mode, date, month, year, type (salary | purchase | tarabi | all)
 *
 * Returns raw expense records filtered by date period.
 */
const getFilteredExpenses = catchAsync(async (req, res) => {
  const mosqueId = mosqueGuard(req, res);
  if (!mosqueId) return;

  const filter = parseFilter(req.query as any);
  const type   = (req.query.type as string) || "all";

  if (!["salary", "purchase", "tarabi", "all"].includes(type)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Invalid type. Use: salary | purchase | tarabi | all",
    });
  }

  const result = await DashboardServices.getFilteredExpensesDB(
    mosqueId,
    filter,
    type as any
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Expenses fetched successfully",
    data: result,
  });
});

const getMonthlyCollectionChart = catchAsync(async (req, res) => {
  const mosqueId = mosqueGuard(req, res);
  if (!mosqueId) return;

  const year   = req.query.year ? Number(req.query.year) : new Date().getFullYear();
  const cacheKey = `dashboard:chart:monthly:${mosqueId}:${year}`;

  try {
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Monthly collection chart data fetched successfully (from Cache)",
        data: cachedResult,
      });
    }
  } catch (error) {
    console.error("Redis error fetching chart cache:", error);
  }

  const result = await DashboardServices.getMonthlyCollectionChartDB(mosqueId, year);

  try {
    await setCache(cacheKey, result, 3600);
  } catch (error) {
    console.error("Redis error setting chart cache:", error);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Monthly collection chart data fetched successfully",
    data: result,
  });
});

/**
 * GET /dashboard/activities
 * Query: limit (default 10)
 */
const getRecentActivities = catchAsync(async (req, res) => {
  const mosqueId = mosqueGuard(req, res);
  if (!mosqueId) return;

  const limit  = req.query.limit ? Number(req.query.limit) : 10;
  const result = await DashboardServices.getRecentActivitiesDB(mosqueId, limit);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Recent activities fetched successfully",
    data: result,
  });
});

/**
 * GET /dashboard/members/payment-status
 * Query: month (YYYY-MM, default current month)
 */
const getMemberPaymentStatus = catchAsync(async (req, res) => {
  const mosqueId = mosqueGuard(req, res);
  if (!mosqueId) return;

  const month  = req.query.month as string | undefined;
  const result = await DashboardServices.getMemberPaymentStatusDB(mosqueId, month);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Member payment status fetched successfully",
    data: result,
  });
});

/**
 * GET /dashboard/staff/salary-overview
 */
const getStaffSalaryOverview = catchAsync(async (req, res) => {
  const mosqueId = mosqueGuard(req, res);
  if (!mosqueId) return;

  const result = await DashboardServices.getStaffSalaryOverviewDB(mosqueId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Staff salary overview fetched successfully",
    data: result,
  });
});

export const DashboardController = {
  getDashboardStats,
  getFilteredCollections,
  getFilteredExpenses,
  getMonthlyCollectionChart,
  getRecentActivities,
  getMemberPaymentStatus,
  getStaffSalaryOverview,
};