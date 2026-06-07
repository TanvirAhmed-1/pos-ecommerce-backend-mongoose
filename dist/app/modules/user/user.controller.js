"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = require("http-status");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_services_1 = require("./user.services");
// CREATE USER
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_services_1.UserService.createUserBD(req.body);
    res.status(http_status_1.status.CREATED).json({
        success: true,
        message: "User created successfully",
        data: result,
    });
});
// LOGIN USER
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await user_services_1.UserService.loginUserBD(email, password);
    res.status(http_status_1.status.OK).json({
        success: true,
        message: "Login successful",
        data: { user, token },
    });
});
// GET USER BY ID
const getUserProfile = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.user.id;
    console.log("Fetching user profile for ID:", id);
    const result = await user_services_1.UserService.getUserProfileBD(id);
    res.status(http_status_1.status.OK).json({
        success: true,
        message: "User fetched successfully",
        data: result,
    });
});
// GET ALL USERS
const getAllUsers = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await user_services_1.UserService.getAllUsers();
    res.status(http_status_1.status.OK).json({
        success: true,
        message: "Users fetched successfully",
        data: result,
    });
});
// UPDATE USER
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const result = await user_services_1.UserService.updateUser(userId, req.body);
    if (!result)
        return res.status(http_status_1.status.NOT_FOUND).json({
            success: false,
            message: "User not found",
        });
    res.status(http_status_1.status.OK).json({
        success: true,
        message: "User updated successfully",
        data: result,
    });
});
// DELETE USER
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const result = await user_services_1.UserService.deleteUser(userId);
    if (!result)
        return res.status(http_status_1.status.NOT_FOUND).json({
            success: false,
            message: "User not found",
        });
    res.status(http_status_1.status.OK).json({
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});
exports.UserController = {
    createUser,
    loginUser,
    getUserProfile,
    getAllUsers,
    updateUser,
    deleteUser,
};
