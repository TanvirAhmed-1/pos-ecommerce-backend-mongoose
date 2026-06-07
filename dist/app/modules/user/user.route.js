"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validateData_1 = __importDefault(require("../../middlewares/validateData"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/create-user", (0, validateData_1.default)(user_validation_1.createUserSchema), user_controller_1.UserController.createUser);
router.post("/login", user_controller_1.UserController.loginUser);
router.get("/get-all-users", (0, auth_1.default)("admin", "superadmin"), user_controller_1.UserController.getAllUsers);
router.get("/get-profile", (0, auth_1.default)(), user_controller_1.UserController.getUserProfile);
router.patch("/update-profile", (0, auth_1.default)(), user_controller_1.UserController.updateUser);
router.delete("/delete-user/:id", (0, auth_1.default)("admin", "superadmin", "user"), user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
