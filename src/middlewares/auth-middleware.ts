import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import { ApiResponse } from "../utils/api-response";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    createdAt: Date;
  };
  token?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.error(res, 401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    const session = await db.query.sessions.findFirst({
      where: eq(sessions.token, token),
      with: {
        user: true,
      },
    });

    if (!session || !session.user) {
      return ApiResponse.error(res, 401, "Unauthorized");
    }

    req.user = {
      id: session.user.id,
      firstname: session.user.firstname,
      lastname: session.user.lastname,
      email: session.user.email,
      createdAt: session.user.createdAt,
    };
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};
