// import { ErrorRequestHandler } from "express";
// import mongoose from "mongoose";
// import { ZodError } from "zod";
// import { generateMongooseError, generateZodError } from "../utils/errorMessageGenerators";
// import config from "../config";

// const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
//   let statusCode = 500;
//   let message = "Something went wrong";
//   let errorMessage = "";

//   if (err instanceof ZodError) {
//     statusCode = 400;
//     message = "Validation Error";
//     errorMessage = generateZodError(err);
//   } else if (err.name === "CastError") {
//     statusCode = 400;
//     message = "Invalid ID";
//     errorMessage = `${err.value} is not a valid ID!`;
//   } else if (err.name === "ValidationError") {
//     statusCode = 400;
//     message = "Validation Error";
//     errorMessage = generateMongooseError(err);
//   } else if (err.code === 11000) {
//     statusCode = 409;
//     message = "Duplicate key not allowed!";
//     const fields = Object.keys(err.keyValue)
//                          .map((key) => `${key}: ${err.keyValue[key]}`)
//                          .join(", ");
//     errorMessage = `Duplicate fields: ${fields}`;
//   } else if (err instanceof Error) {
//     message = err.message;
//     errorMessage = err.message;
//   }

//   return res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//     errorMessage,
//     stack: config.env === "development" ? err.stack : undefined,
//   });
// };

// export default globalErrorHandler;


import { ErrorRequestHandler } from "express";
import config from "../config";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";
import { TErrorSources } from "../interfaces/errors";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {

  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  // ২. নির্দিষ্ট এরর টাইপ অনুযায়ী হ্যান্ডলার কল করা
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } 
  else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } 
  else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } 
  else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } 
  else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } 
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  // ৩. ফাইনাল রেসপন্স (Standard API Format)
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources, 
    stack: config.env === "development" ? err?.stack : undefined,
  });
};

export default globalErrorHandler;