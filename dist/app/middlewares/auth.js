"use strict";
// import { NextFunction, Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import config from "../config";
// import catchAsync from "../utils/catchAsync";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, _res, next) => {
        const authHeader = req.headers.authorization;
        // ১. টোকেন চেক
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("You are not authorized! Token is missing.");
        }
        const token = authHeader.split(" ")[1];
        // ২. ভেরিফাই টোকেন
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        // ৩. রোল চেক
        if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
            throw new Error("You do not have permission to access this route");
        }
        // ৪. রিকোয়েস্টে ইউজার সেট করা
        req.user = decoded;
        next();
    });
};
exports.default = auth;
