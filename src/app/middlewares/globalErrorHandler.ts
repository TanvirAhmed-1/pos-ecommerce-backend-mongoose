import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { generateMongooseError, generateZodError } from "../utils/errorMessageGenerators";
import config from "../config";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorMessage = "";

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorMessage = generateZodError(err);
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
    errorMessage = `${err.value} is not a valid ID!`;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errorMessage = generateMongooseError(err);
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate key not allowed!";
    const fields = Object.keys(err.keyValue)
                         .map((key) => `${key}: ${err.keyValue[key]}`)
                         .join(", ");
    errorMessage = `Duplicate fields: ${fields}`;
  } else if (err instanceof Error) {
    message = err.message;
    errorMessage = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorMessage,
    stack: config.env === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;