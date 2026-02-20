import { Router } from "express";
import { memberController } from "./member.controller";
import { createMemberValidationSchema } from "./member.validation";
import validateRequest from "../../../middlewares/validateRequest";
import { auth } from "../../../middlewares/auth.middleware";

const router = Router();

router.use(auth());

router.post(
  "/mosque/members",
  validateRequest(createMemberValidationSchema),
  memberController.createMember,
);
router.get("/mosque/members", memberController.getAllMembers);
router.get("/mosque/members/:id", memberController.getMemberById);
router.put("/mosque/members/:id", memberController.updateMember);
router.delete("/mosque/members/:id", memberController.deleteMember);

export const mosquememberRoutes = router;
