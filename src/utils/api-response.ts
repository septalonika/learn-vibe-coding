import { Response } from "express";

export class ApiResponse {
  static success(res: Response, data: any, message: string = "Success", status: number = 200) {
    return res.status(status).json({
      message,
      data,
    });
  }

  static error(res: Response, status: number, message: string, error: any = null) {
    return res.status(status).json({
      message,
      error: error || (status === 400 ? "Bad Request" : status === 401 ? "Unauthorized" : "Internal Server Error"),
    });
  }
}
