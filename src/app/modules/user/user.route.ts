import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createUserSchema, loginSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserSchema),

  UserController.createdUser
);
router.get("/users", UserController.fetchUser);
router.post("/login", UserController.loginUser);
router.delete("/users/:userId", UserController.deleteUser);
router.put("/users/:userId", UserController.updateUser);

router.post("/refresh-token", UserController.generateAccessTokenFromRefresh);

export const userRoute = router;
