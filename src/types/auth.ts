import { Request } from "express";

export interface AuthUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  token?: string;
}
