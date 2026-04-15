import { Response } from "express";

export class ApiResponse {
  static success(res: Response, data: unknown, message: string = "Success", status: number = 200) {
    return res.status(status).json({
      message,
      data,
    });
  }

  static error(res: Response, status: number, message: string, error: unknown = null) {
    return res.status(status).json({
      message,
      error: error !== null ? error : (status === 400 ? "Bad Request" : status === 401 ? "Unauthorized" : "Internal Server Error"),
    });
  }
}
