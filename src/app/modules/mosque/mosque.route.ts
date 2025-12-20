import { Router } from "express";
import { mosqueController } from "./mosque.controller";
import validateRequest from "../../middlewares/validateRequest";
//import { auth } from "../../middlewares/auth.middleware";
import { createMosqueWithAdminSchema } from "./mosque.validation";

const router = Router();

// router.use(auth("SUPER_ADMIN"));

router.get("/mosques", mosqueController.getAllMosques);
router.post(
  "/mosques",
  validateRequest(createMosqueWithAdminSchema),
  mosqueController.createmosque
);
router.get("/mosques/:id", mosqueController.getMosqueById);
router.put("/mosques/:id", mosqueController.updateMosque);
router.delete("/mosques/:id", mosqueController.deleteMosque);

export const mosqueRoutes = router;
