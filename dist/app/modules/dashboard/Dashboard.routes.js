"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const Dashboard_controller_1 = require("./Dashboard.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const route = (0, express_1.Router)();
route.use((0, auth_middleware_1.auth)());
// ─── Overview & finance ─────────────────────────────────────────────────────
// GET /dashboard/stats?mode=month&month=4&year=2026
// GET /dashboard/stats?mode=date&date=2026-04-09
// GET /dashboard/stats?mode=year&year=2026
route.get("/dashboard/stats", Dashboard_controller_1.DashboardController.getDashboardStats);
// ─── Collection records (revenue) ──────────────────────────────────────────
// GET /dashboard/collections?mode=month&month=4&year=2026&type=friday
// GET /dashboard/collections?mode=year&year=2026&type=all
route.get("/dashboard/collections", Dashboard_controller_1.DashboardController.getFilteredCollections);
// ─── Expense records ────────────────────────────────────────────────────────
// GET /dashboard/expenses?mode=month&month=4&year=2026&type=salary
// GET /dashboard/expenses?mode=date&date=2026-04-09&type=all
route.get("/dashboard/expenses", Dashboard_controller_1.DashboardController.getFilteredExpenses);
// ─── Chart ──────────────────────────────────────────────────────────────────
// GET /dashboard/chart/monthly?year=2026
route.get("/dashboard/chart/monthly", Dashboard_controller_1.DashboardController.getMonthlyCollectionChart);
// ─── Activities ─────────────────────────────────────────────────────────────
// GET /dashboard/activities?limit=10
route.get("/dashboard/activities", Dashboard_controller_1.DashboardController.getRecentActivities);
// ─── Members ────────────────────────────────────────────────────────────────
// GET /dashboard/members/payment-status?month=2026-04
route.get("/dashboard/members/payment-status", Dashboard_controller_1.DashboardController.getMemberPaymentStatus);
// ─── Staff ──────────────────────────────────────────────────────────────────
// GET /dashboard/staff/salary-overview
route.get("/dashboard/staff/salary-overview", Dashboard_controller_1.DashboardController.getStaffSalaryOverview);
exports.dashboardRoutes = route;
