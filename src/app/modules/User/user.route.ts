import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserSchema } from "./user.validation";
import validateData from "../../middlewares/validateData";
import auth from "../../middlewares/auth";
import { uploadAndAttachSingle, parseMultipartBody } from "../../middlewares/upload";

const router = Router();

router.post(
  "/create-user",
  uploadAndAttachSingle("avatar", "avatar", "users"),
  parseMultipartBody,
  validateData(createUserSchema),
  UserController.createUser,
);
router.post("/login", UserController.loginUser);
router.get("/get-all-users", auth("admin", "superadmin"), UserController.getAllUsers);
router.get("/get-profile", auth(), UserController.getUserProfile);
router.patch(
  "/update-profile",
  auth(),
  uploadAndAttachSingle("avatar", "avatar", "users"),
  parseMultipartBody,
  UserController.updateUser,
);
router.patch(
  "/update-user/:id",
  auth("admin", "superadmin"),
  UserController.updateUserById,
);
router.delete(
  "/delete-user/:id",
  auth("admin", "superadmin", "customer", "reseller"),
  UserController.deleteUser,
);

export const UserRoutes = router;
