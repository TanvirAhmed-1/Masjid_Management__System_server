import { Router } from "express";

import { MemberValidation } from "./member.validation";
import { memberController } from "./member.controller";
import validateRequest from "../../../middlewares/validateRequest";

const router = Router();

router.post(
  "/members",
  validateRequest(MemberValidation.create),
  memberController.createMember
);
router.get("/members", memberController.getMembers);

router.get("/members/:id", memberController.getMemberById);

router.put("/members/:id", memberController.updateMember);

router.delete("/members/:id", memberController.deleteMember);

export const memberRoutes = router;
