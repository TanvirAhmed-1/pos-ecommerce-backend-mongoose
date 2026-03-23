// import { NextFunction, Request, Response } from "express";
// import { AnyZodObject } from "zod";

// const validateData = (schemaObj: AnyZodObject) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Validates schema object
//       await schemaObj.parseAsync(req.body);
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// export default validateData;

import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateData = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // এটি সবথেকে সেফ পদ্ধতি কারণ এটি body, params, এবং query একসাথে চেক করে
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      next();
    } catch (err) {
      // এরর হলে সরাসরি গ্লোবাল এরর হ্যান্ডলারে পাঠিয়ে দিবে
      next(err);
    }
  };
};

export default validateData;
