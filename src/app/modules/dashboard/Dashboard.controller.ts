import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { DashboardServices } from "./Dashboard.services";

const getDashboardStats = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;

  if (!mosqueId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Mosque not found in token",
    });
  }

  const result = await DashboardServices.getDashboardStatsDB(mosqueId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Dashboard statistics fetched successfully",
    data: result,
  });
});

const getMonthlyCollectionChart = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;

  if (!mosqueId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Mosque not found in token",
    });
  }

  const year = req.query.year
    ? Number(req.query.year)
    : new Date().getFullYear();

  const result = await DashboardServices.getMonthlyCollectionChartDB(
    mosqueId,
    year,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Monthly collection chart data fetched successfully",
    data: result,
  });
});

const getRecentActivities = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;

  if (!mosqueId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Mosque not found in token",
    });
  }

  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const result = await DashboardServices.getRecentActivitiesDB(mosqueId, limit);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Recent activities fetched successfully",
    data: result,
  });
});

const getMemberPaymentStatus = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;

  if (!mosqueId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Mosque not found in token",
    });
  }

  const month = req.query.month as string | undefined;

  const result = await DashboardServices.getMemberPaymentStatusDB(
    mosqueId,
    month,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Member payment status fetched successfully",
    data: result,
  });
});

const getStaffSalaryOverview = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;

  if (!mosqueId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Mosque not found in token",
    });
  }

  const result = await DashboardServices.getStaffSalaryOverviewDB(mosqueId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Staff salary overview fetched successfully",
    data: result,
  });
});

export const DashboardController = {
  getDashboardStats,
  getMonthlyCollectionChart,
  getRecentActivities,
  getMemberPaymentStatus,
  getStaffSalaryOverview,
};
