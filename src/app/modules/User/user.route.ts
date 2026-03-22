import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserSchema } from "./user.validation";
import validateData from "../../middlewares/validateData";

const router = Router();

router.post(
  "/create-user",
  validateData(createUserSchema),
  UserController.createUser,
);
router.post("/login", UserController.loginUser);
router.get("/get-all-users", UserController.getAllUsers);
router.get("/get-profile", UserController.getUserProfile);
router.patch("/update-profile", UserController.updateUser);
router.delete("/delete-user/:id", UserController.deleteUser);

export const UserRoutes = router;
