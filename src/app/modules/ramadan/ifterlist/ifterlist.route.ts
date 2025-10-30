import { Router } from "express";
import { ifterlistcontroller } from "./ifterlist.controller";
import { auth } from "../../../middlewares/auth.middleware";
import validateRequest from "../../../middlewares/validateRequest";
import { ifterlistSchema } from "./ifterlist.validation";

const router = Router();
router.use(auth());

router.get("/ifterlists", ifterlistcontroller.getifterlist);

router.post(
  "/ifterlists",
  validateRequest(ifterlistSchema),
  ifterlistcontroller.createifterlist
);

router.get("/ifterlists/:id", ifterlistcontroller.getsingleifterlist);

router.put("/ifterlists/:id", ifterlistcontroller.updateifterlist);

router.delete("/ifterlists/:id", ifterlistcontroller.deleteifterlist);

export const ifterlistRoutes = router;
