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
import { mosqueRoutes } from "../modules/mosque/mosque.route";
import { staffRoutes } from "../modules/management-cost/staff/satff.route";
const router = Router();

const allRouters = [
  userRoute,
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
];

allRouters.forEach((route) => router.use(route));

export const BaseRouter = router;
