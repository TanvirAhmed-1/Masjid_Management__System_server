"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const ramadan_datasetup_route_1 = require("../modules/ramadan/ramadan-datasetup/ramadan-datasetup.route");
const itikaf_route_1 = require("../modules/ramadan/itikaf/itikaf.route");
const ifterlist_route_1 = require("../modules/ramadan/ifterList/ifterlist.route");
const member_routes_1 = require("../modules/monthly-salary/member/member.routes");
const payment_routes_1 = require("../modules/monthly-salary/payment/payment.routes");
const ramadan_tarabi_salary_route_1 = require("../modules/ramadan/ramadan-tarabi-salary/ramadan-tarabi-salary.route");
const friday_collection_route_1 = require("../modules/collection/friday-collection/friday-collection.route");
const otherCollectionName_route_1 = require("../modules/collection/collection-datasetUp-Name/otherCollectionName.route");
const other_collection_route_1 = require("../modules/collection/other-collection/other-collection.route");
const mosque_route_1 = require("../modules/mosqueManagement/mosque/mosque.route");
const satff_route_1 = require("../modules/management-cost/staff/satff.route");
const staff_salary_payment_route_1 = require("../modules/management-cost/satff-salary-payment/staff-salary-payment.route");
const monthly_salary_route_1 = require("../modules/management-cost/monthly-salary/monthly-salary.route");
const member_route_1 = require("../modules/mosqueManagement/member/member.route");
const Dashboard_routes_1 = require("../modules/dashboard/Dashboard.routes");
const accessory_routers_1 = require("../modules/monthly-salary/accessoryPurchase/accessory.routers");
const router = (0, express_1.Router)();
const allRouters = [
    user_route_1.userRoute,
    member_route_1.mosquememberRoutes,
    mosque_route_1.mosqueRoutes,
    ramadan_datasetup_route_1.ramadanDataSetUpRoute,
    itikaf_route_1.itikaRoutes,
    ifterlist_route_1.ifterlistRoutes,
    member_routes_1.memberRoutes,
    payment_routes_1.paymentRoutes,
    ramadan_tarabi_salary_route_1.ramadanTarabiPaymentRoutes,
    friday_collection_route_1.fridayCollectionRoutes,
    otherCollectionName_route_1.otherCollectionNameRoutes,
    other_collection_route_1.otherCollectionRoutes,
    satff_route_1.staffRoutes,
    staff_salary_payment_route_1.staffSalaryPaymentRoutes,
    monthly_salary_route_1.monthlySalaryRoutes,
    Dashboard_routes_1.dashboardRoutes,
    accessory_routers_1.accessoryPurchaseRoutes,
];
allRouters.forEach((route) => router.use(route));
exports.BaseRouter = router;
