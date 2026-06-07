
import { NextFunction, Request, Response } from "express";

const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).json({
    success: false,
    statusCode: 404,
    message: "API not found",
  });
};

export default notFound;
