"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUserBD = async (data) => {
    const saltRounds = config_1.default.bcrypt.saltRounds || 10;
    const hashedPassword = await bcrypt_1.default.hash(data.password, saltRounds);
    // spread input and overwrite password
    const payloadUser = { ...data, password: hashedPassword };
    const result = await user_model_1.UserModel.create(payloadUser);
    return result;
};
const loginUserBD = async (email, password) => {
    const user = await user_model_1.UserModel.findOne({ email }).select("+password");
    if (!user)
        throw new Error("Invalid email or password");
    const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatch)
        throw new Error("Invalid email or password");
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, {
        expiresIn: "72h",
    });
    return { user, token };
};
const updateUser = async (id, data) => {
    if (data.password) {
        data.password = await bcrypt_1.default.hash(data.password, Number(config_1.default.bcrypt.saltRounds));
    }
    const result = await user_model_1.UserModel.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
        runValidators: true,
    });
    if (!result)
        throw new Error("User not found to update");
    return result;
};
const getUserProfileBD = async (id) => {
    if (!id) {
        throw new Error("User ID is undefined");
    }
    const user = await user_model_1.UserModel.findById(id);
    if (!user)
        throw new Error("User not found");
    return user;
};
const deleteUser = async (id) => {
    const existingUser = await user_model_1.UserModel.findById(id);
    if (!existingUser) {
        throw new Error("User not found");
    }
    const result = await user_model_1.UserModel.findByIdAndDelete(id);
    return result;
};
const getAllUsers = async () => {
    const users = await user_model_1.UserModel.find();
    return users;
};
exports.UserService = {
    createUserBD,
    loginUserBD,
    updateUser,
    deleteUser,
    getUserProfileBD,
    getAllUsers,
};
