import { Router } from "express";
import { ifterlistcontroller } from "./ifterlist.controller";
import { auth } from "../../../middlewares/auth.middleware";
import { ifterListSchema } from "./ifterlist.validation";
import validateRequest from "../../../middlewares/validateRequest";

const router = Router();
router.use(auth());

router.get("/ifterlists", ifterlistcontroller.getifterlist);

router.post(
  "/ifterlists",
  validateRequest(ifterListSchema),
  ifterlistcontroller.createifterlist
);

router.get("/ifterlists/:ramadanyearId", ifterlistcontroller.getsingleifterlist);

router.put("/ifterlists/:id", ifterlistcontroller.updateifterlist);

router.delete("/ifterlists/:id", ifterlistcontroller.deleteifterlist);

router.delete("/ifterlists/doner/:id", ifterlistcontroller.deleteifterdoner);

export const ifterlistRoutes = router;
