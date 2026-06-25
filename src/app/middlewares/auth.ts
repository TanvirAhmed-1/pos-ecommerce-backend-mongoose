// import { NextFunction, Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import config from "../config";
// import catchAsync from "../utils/catchAsync";

// const auth = (...requiredRoles: string[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization;

//     // ১. চেক করবেন টোকেন পাঠানো হয়েছে কি না
//     if (!token) {
//       throw new Error("You are not authorized!");
//     }

//     // ২. টোকেন ভেরিফাই করা
//     const decoded = jwt.verify(
//       token,
//       config.jwtSecret as string
//     ) as JwtPayload;

//     const { role} = decoded;

//     // ৩. রোল ভ্যালিডেশন (ঐচ্ছিক: যদি নির্দিষ্ট রোল লাগে)
//     if (requiredRoles.length && !requiredRoles.includes(role)) {
//       throw new Error("You are not authorized to access this route");
//     }

//     // ৪. রিকোয়েস্ট অবজেক্টে ইউজার সেট করা (যাতে কন্ট্রোলারে পাওয়া যায়)
//     req.user = decoded as JwtPayload;
    
    
//     next();
//   });
// };

// export default auth;

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // ১. টোকেন চেক
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized! Token is missing.");
    }

    const token = authHeader.split(" ")[1];

    // ২. ভেরিফাই টোকেন
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;
    } catch (err: any) {
      throw new AppError(httpStatus.UNAUTHORIZED, err.message || "Unauthorized");
    }

    // ৩. রোল চেক
    if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to access this route");
    }

    // ৪. রিকোয়েস্টে ইউজার সেট করা
    req.user = decoded;
    next();
  });
};

export default auth;