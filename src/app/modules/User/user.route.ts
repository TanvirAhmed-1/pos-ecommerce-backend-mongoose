import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserSchema } from "./user.validation";
import validateData from "../../middlewares/validateData";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
  "/create-user",
  validateData(createUserSchema),
  UserController.createUser,
);
router.post("/login", UserController.loginUser);
router.get("/get-all-users", UserController.getAllUsers);
router.get("/get-profile", auth("user"), UserController.getUserProfile);
router.patch("/update-profile", auth("user"), UserController.updateUser);
router.delete(
  "/delete-user/:id",
  auth("admin,user"),
  UserController.deleteUser,
);

export const UserRoutes = router;
