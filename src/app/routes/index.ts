import { Router } from "express";
import { userRoute } from "../modules/user/user.route";
import { ramadanDataSetUpRoute } from "../modules/ramadan/ramadan-datasetup/ramadan-datasetup.route";
import { itikaRoutes } from "../modules/ramadan/itikaf/itikaf.route";
import { ifterlistRoutes } from "../modules/ramadan/ifterList/ifterlist.route";
import { memberRoutes } from "../modules/monthly-salary/member/member.routes";
import { paymentRoutes } from "../modules/monthly-salary/payment/payment.routes";
import { ramadanTarabiSalaryRoutes } from "../modules/ramadan/ramadan-tarabi-salary/ramadan-tarabi-salary.route";
import { fridayCollectionRoutes } from "../modules/collection/friday-collection/friday-collection.route";
import { otherCollectionNameRoutes } from "../modules/collection/collection-datasetUp-Name/otherCollectionName.route";
import { otherCollectionRoutes } from "../modules/collection/other-collection/other-collection.route";
import { mosqueRoutes } from "../modules/mosqueManagement/mosque/mosque.route";
import { staffRoutes } from "../modules/management-cost/staff/satff.route";
import { staffSalaryPaymentRoutes } from "../modules/management-cost/satff-salary-payment/staff-salary-payment.route";
import { monthlySalaryRoutes } from "../modules/management-cost/monthly-salary/monthly-salary.route";
import { mosquememberRoutes } from "../modules/mosqueManagement/member/member.route";
import { dashboardRoutes } from "../modules/dashboard/Dashboard.routes";
import { accessoryPurchaseRoutes } from "../modules/monthly-salary/accessoryPurchase/accessory.routers";

const router = Router();

const allRouters = [
  userRoute,
  mosquememberRoutes,
  mosqueRoutes,
  ramadanDataSetUpRoute,
  itikaRoutes,
  ifterlistRoutes,
  memberRoutes,
  paymentRoutes,
  ramadanTarabiSalaryRoutes,
  fridayCollectionRoutes,
  otherCollectionNameRoutes,
  otherCollectionRoutes,
  staffRoutes,
  staffSalaryPaymentRoutes,
  monthlySalaryRoutes,
  dashboardRoutes,
  accessoryPurchaseRoutes,
];

allRouters.forEach((route) => router.use(route));

export const BaseRouter = router;
