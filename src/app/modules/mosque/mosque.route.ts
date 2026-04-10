import { Router } from "express";
import { mosqueController } from "./mosque.controller";
import { auth } from "../../middlewares/auth.middleware";
import { cacheMiddleware } from "../../middlewares/cache.middleware";

const route = Router();

route.use(auth());

route.get("/get-mosque",cacheMiddleware("mosque"), mosqueController.getMosque);
route.put("/update-mosque", mosqueController.updateMosque);

export const mosquegetRoutes = route;
