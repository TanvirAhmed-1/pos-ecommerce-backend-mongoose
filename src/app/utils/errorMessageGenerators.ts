import mongoose from "mongoose";
import { ZodError } from "zod";

export const generateMongooseError = (err: mongoose.Error.ValidationError) => 
  Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");

export const generateZodError = (err: ZodError) =>
  err.issues
     .map((i) => `${i.path[i.path.length - 1]} is ${i.message.toLowerCase()}`)
     .join(", ");