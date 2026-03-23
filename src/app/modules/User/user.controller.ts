import { Request, Response } from "express";
import { status } from "http-status";
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./user.services";

// CREATE USER
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUserBD(req.body);
  res.status(status.CREATED).json({
    success: true,
    message: "User created successfully",
    data: result,
  });
});

// LOGIN USER
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await UserService.loginUserBD(email, password);

  res.status(status.OK).json({
    success: true,
    message: "Login successful",
    data: { user, token },
  });
});

// GET USER BY ID
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  console.log("Fetching user profile for ID:", id);
  const result = await UserService.getUserProfileBD(id);

  res.status(status.OK).json({
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

// GET ALL USERS
const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  res.status(status.OK).json({
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

// UPDATE USER
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await UserService.updateUser(userId, req.body);
  if (!result)
    return res.status(status.NOT_FOUND).json({
      success: false,
      message: "User not found",
    });

  res.status(status.OK).json({
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

// DELETE USER
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await UserService.deleteUser(userId);
  if (!result)
    return res.status(status.NOT_FOUND).json({
      success: false,
      message: "User not found",
    });

  res.status(status.OK).json({
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updateUser,
  deleteUser,
};
