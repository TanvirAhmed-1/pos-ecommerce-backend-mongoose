"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const catchAsync = (func) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next)).catch((err) => {
            // Handling invalid categoryId error
            if (err.message === "Category not found") {
                res.status(http_status_1.default.BAD_REQUEST).json({
                    success: false,
                    message: err.message,
                    errorMessage: "Please provide a categoryId for an existing category.",
                    errorDetails: null,
                    stack: null,
                });
            }
            // Handling unauthorized access
            if (err.message === "Unauthorized Access") {
                res.status(http_status_1.default.UNAUTHORIZED).json({
                    success: false,
                    message: err.message,
                    errorMessage: "You do not have the necessary permissions to access this resource.",
                    errorDetails: null,
                    stack: null,
                });
            }
            //Handing user not found
            if (err.message === "User not found") {
                res.status(http_status_1.default.NOT_FOUND).json({
                    success: false,
                    message: err.message,
                    errorMessage: "No user found for the credentials you provided",
                    errorDetails: null,
                    stack: null,
                });
            }
            //Handling password does not match
            if (err.message === "Incorrect password") {
                res.status(http_status_1.default.UNAUTHORIZED).json({
                    success: false,
                    message: err.message,
                    errorMessage: "Please provide the correct password. Username and password doesn't match.",
                    errorDetails: null,
                    stack: null,
                });
            }
            // Handling changing password error
            if (err.message.includes("Password change failed")) {
                res.status(http_status_1.default.BAD_REQUEST).json({
                    success: false,
                    statusCode: 400,
                    message: err?.message,
                    data: null,
                });
            }
            next(err);
        });
    };
};
exports.default = catchAsync;
