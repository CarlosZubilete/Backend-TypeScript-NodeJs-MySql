import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/exception.unauthorized";
import { ErrorCode } from "../exceptions/exception.root";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user.role != "ADMIN")
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);

  next();
};
