import { Router } from "express";
import { DashboardController } from "./Dashboard.controller";
import { auth } from "../../middlewares/auth.middleware";

const route = Router();

route.use(auth());

route.get("/dashboard/stats", DashboardController.getDashboardStats);

route.get(
  "/dashboard/chart/monthly",
  DashboardController.getMonthlyCollectionChart,
);

route.get("/dashboard/activities", DashboardController.getRecentActivities);

route.get(
  "/dashboard/members/payment-status",
  DashboardController.getMemberPaymentStatus,
);

route.get(
  "/dashboard/staff/salary-overview",
  DashboardController.getStaffSalaryOverview,
);

export const dashboardRoutes = route;
