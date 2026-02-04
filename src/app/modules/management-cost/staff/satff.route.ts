import { createStaffSchema } from "./satff.validation";
import { Router } from "express";
import { satffController } from "./satff.controller";
import validateRequest from "../../../middlewares/validateRequest";

const router = Router();

router.post(
  "/staffs",
  validateRequest(createStaffSchema),
  satffController.createsatff
);
router.get("/staffs", satffController.getAllstaff);

router.get("/staffs/:id", satffController.getstaffById);

router.put("/staffs/status/:id", satffController.updatestaffStatus);

router.put("/staffs/:id", satffController.updatestaff);

router.delete("/staffs/:id", satffController.deletestaff);

export const staffRoutes = router;
