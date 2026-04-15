import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
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

  // PostgreSQL errors (including Drizzle-wrapped causes)
  const pgCode = err.code || err.cause?.code;

  if (pgCode === "22001") {
    return ApiResponse.error(res, 400, "Input value exceeds allowed length");
  }
  
  if (pgCode === "23505") {
    return ApiResponse.error(res, 400, "User already exists");
  }

  // Zod validation errors
  if (err instanceof ZodError || err.name === "ZodError") {
    return ApiResponse.error(res, 400, "Validation Error", err.errors);
  }

  // Default catch-all
  // console.error(err); // Un-comment for deep debugging
  return ApiResponse.error(res, 500, "An unexpected error occurred");
};
