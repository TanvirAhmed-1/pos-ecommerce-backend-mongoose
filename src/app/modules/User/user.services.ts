import config from "../../config";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUserBD = async (data: IUser) => {
  const saltRounds = config.bcrypt.saltRounds || 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  // spread input and overwrite password
  const payloadUser = { ...data, password: hashedPassword };

  const result = await UserModel.create(payloadUser);
  return result;
};

const loginUserBD = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password");

  if (user.status === "blocked") {
    throw new Error("Your account has been blocked!");
  }

  if (user.status === "inactive") {
    throw new Error("Your account is inactive!");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw new Error("Invalid email or password");

  const payload = { id: user._id, email: user.email, role: user.role };
  const token = jwt.sign(payload, config.jwtSecret as string, {
    expiresIn: "72h",
  });

  return { user, token };
};

const updateUser = async (id: string, data: Partial<IUser>) => {
  if (data.password) {
    data.password = await bcrypt.hash(
      data.password,
      Number(config.bcrypt.saltRounds),
    );
  }

  const result = await UserModel.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!result) throw new Error("User not found to update");
  return result;
};

const getUserProfileBD = async (id: string) => {
  if (!id) {
    throw new Error("User ID is undefined");
  }
  const user = await UserModel.findById(id);
  if (!user) throw new Error("User not found");
  return user;
};

const deleteUser = async (id: string) => {
  const existingUser = await UserModel.findById(id);
  if (!existingUser) {
    throw new Error("User not found");
  }

  const result = await UserModel.findByIdAndDelete(id);
  return result;
};

const getAllUsers = async () => {
  const users = await UserModel.find();
  return users;
};

export const UserService = {
  createUserBD,
  loginUserBD,
  updateUser,
  deleteUser,
  getUserProfileBD,
  getAllUsers,
};
