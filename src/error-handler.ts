// import { Request, Response, NextFunction, RequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import { ErrorCode, HttpException } from "./exceptions/exception.root";
import { InternalException } from "./exceptions/exception.internal";

// export const errorHandler = (method: RequestHandler): RequestHandler => {
export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (err) {
      let exception: HttpException;
      if (err instanceof HttpException) {
        exception = err;
      } else {
        exception = new InternalException(
          "Something went wrong!",
          err,
          ErrorCode.INTERNAL_EXCEPTION
        );
      }
      next(exception);
    }
  };
};
