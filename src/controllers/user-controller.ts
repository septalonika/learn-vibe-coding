import { Request, Response, NextFunction } from "express";
import { usersService } from "../services/users-service";
import { ApiResponse } from "../utils/api-response";
import { AuthRequest } from "../middlewares/auth-middleware";

export class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await usersService.registerUser(req.body);
      return ApiResponse.success(res, newUser, "User created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await usersService.loginUser(req.body);
      return ApiResponse.success(res, token, "Login successfully");
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // User is already attached to req by authMiddleware
      return ApiResponse.success(res, req.user, "User found");
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.token) {
        throw new Error("Unauthorized");
      }
      await usersService.logoutUser(req.token);
      return ApiResponse.success(res, null, "Logout success");
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
