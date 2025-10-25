import { auth } from "./../../../middlewares/auth.middleware";
import { Router } from "express";
import { ramadandatacontroller } from "./ramadan-datasetup.controller";
import { ramadandatasetupSchema } from "./ramadan-datasetup.validation";
import validateRequest from "../../../middlewares/validateRequest";
const router = Router();


router.use(auth());

router.post(
  "/ramadan-data-setups",
  validateRequest(ramadandatasetupSchema),
  ramadandatacontroller.createdRamadanDatasetUp
);

router.get("/ramadan-data-setups", ramadandatacontroller.getRamadanDatasetUp);

router.delete(
  "/ramadan-data-setups/:ramadanyearId",
  ramadandatacontroller.deleteRamadanDatasetUp
);

router.put(
  "/ramadan-data-setups/:ramadanyearId",
  ramadandatacontroller.updateRamadanDatasetUp
);

export const ramadanDataSetUpRoute = router;
