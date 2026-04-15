import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/api-response";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  // If headers are already sent, delegate to the default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Domain specific errors
  if (err.message === "User already exists" || err.message === "User not found") {
    return ApiResponse.error(res, 400, err.message);
  }

  if (err.message === "Unauthorized") {
    return ApiResponse.error(res, 401, "Unauthorized");
  }

  // Zod validation errors (we'll handle this in validate-middleware too, but good to have here)
  if (err.name === "ZodError") {
    return ApiResponse.error(res, 400, "Validation Error", err.errors);
  }

  // Default catch-all
  console.error(err);
  return ApiResponse.error(res, 500, "An unexpected error occurred");
};
