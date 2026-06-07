"use strict";
// import { NextFunction, Request, Response } from "express";
// import { AnyZodObject } from "zod";
Object.defineProperty(exports, "__esModule", { value: true });
const validateData = (schema) => {
    return async (req, _res, next) => {
        try {
            // এটি সবথেকে সেফ পদ্ধতি কারণ এটি body, params, এবং query একসাথে চেক করে
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
            });
            next();
        }
        catch (err) {
            // এরর হলে সরাসরি গ্লোবাল এরর হ্যান্ডলারে পাঠিয়ে দিবে
            next(err);
        }
    };
};
exports.default = validateData;
