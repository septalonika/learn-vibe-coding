import type { Request, Response, NextFunction } from "express";
import { type ZodObject, ZodError } from "zod";
import { ApiResponse } from "../utils/api-response";

export const validateRequest = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error.name === "ZodError") {
        return ApiResponse.error(res, 400, "Validation Error", error.issues);
      }
      next(error);
    }
  };
};
