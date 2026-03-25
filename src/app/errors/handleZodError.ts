import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/errors";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1] as string | number,
      message: issue.message,
    };
  });

  return {
    statusCode: 400,
    message: "Zod Validation Error",
    errorSources,
  };
};

export default handleZodError;
