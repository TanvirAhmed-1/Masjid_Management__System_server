import { Router } from "express";
import { userRoute } from "../modules/user/user.route";
const router = Router();

const allRouters = [userRoute];

allRouters.forEach((route) => router.use(route));

export const BaseRouter = router;
