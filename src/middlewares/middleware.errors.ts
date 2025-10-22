import e, { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/exception.root";

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error._statusCode).json({
    message: error._message,
    errorCode: error._errorCode,
    errors: error._errors,
  });
};
