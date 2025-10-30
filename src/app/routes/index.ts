import { Router } from "express";
import { userRoute } from "../modules/user/user.route";
import { ramadanDataSetUpRoute } from "../modules/ramadan/ramadan-datasetup/ramadan-datasetup.route";
import { itikaRoutes } from "../modules/ramadan/itikaf/itikaf.route";
import { ifterlistRoutes } from "../modules/ramadan/ifterlist/ifterlist.route";
const router = Router();

const allRouters = [
  userRoute,
  ramadanDataSetUpRoute,
  itikaRoutes,
  ifterlistRoutes,
];

allRouters.forEach((route) => router.use(route));

export const BaseRouter = router;
