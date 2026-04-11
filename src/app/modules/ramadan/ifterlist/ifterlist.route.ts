import { Router } from "express";
import { auth } from "../../../middlewares/auth.middleware";
import validateRequest from "../../../middlewares/validateRequest";
import { ifterlistcontroller } from "./ifterlist.controller";
import { ifterListSchema } from "./ifterlist.validation";

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
