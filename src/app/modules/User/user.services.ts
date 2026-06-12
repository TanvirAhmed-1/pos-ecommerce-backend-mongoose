import config from "../../config";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { deleteFromCloudinary } from "../../utils/cloudinary";

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
  const isExist = await UserModel.findById(id);
  if (!isExist) throw new Error("User not found to update");

  if (data.password) {
    data.password = await bcrypt.hash(
      data.password,
      Number(config.bcrypt.saltRounds),
    );
  }

  // Delete old avatar from Cloudinary if changed
  if (data.avatar && isExist.avatar && isExist.avatar !== data.avatar) {
    try {
      await deleteFromCloudinary(isExist.avatar);
    } catch (error) {
      console.error("Failed to delete old avatar from Cloudinary:", error);
    }
  }

  const result = await UserModel.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

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

  // Delete avatar from Cloudinary
  if (existingUser.avatar) {
    try {
      await deleteFromCloudinary(existingUser.avatar);
    } catch (error) {
      console.error("Failed to delete user avatar from Cloudinary:", error);
    }
  }

  const result = await UserModel.findByIdAndDelete(id);
  return result;
};

const getAllUsers = async (query: Record<string, any> = {}) => {
  const { searchTerm, page = 1, limit = 10 } = query;
  
  let filter: any = {};
  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, "i");
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
    ];
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const total = await UserModel.countDocuments(filter);
  const data = await UserModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  const totalPage = Math.ceil(total / limitNumber);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage,
    },
    data,
  };
};

export const UserService = {
  createUserBD,
  loginUserBD,
  updateUser,
  deleteUser,
  getUserProfileBD,
  getAllUsers,
};
