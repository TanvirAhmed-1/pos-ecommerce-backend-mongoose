import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import catchAsync from "../utils/catchAsync";

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // ১. চেক করবেন টোকেন পাঠানো হয়েছে কি না
    if (!token) {
      throw new Error("You are not authorized!");
    }

    // ২. টোকেন ভেরিফাই করা
    const decoded = jwt.verify(
      token,
      config.jwtSecret as string
    ) as JwtPayload;

    const { role} = decoded;

    // ৩. রোল ভ্যালিডেশন (ঐচ্ছিক: যদি নির্দিষ্ট রোল লাগে)
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error("You are not authorized to access this route");
    }

    // ৪. রিকোয়েস্ট অবজেক্টে ইউজার সেট করা (যাতে কন্ট্রোলারে পাওয়া যায়)
    req.user = decoded as JwtPayload;
    
    
    next();
  });
};

export default auth;