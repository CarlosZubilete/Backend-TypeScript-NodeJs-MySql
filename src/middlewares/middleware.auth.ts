import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/exception.unauthorized";
import { ErrorCode } from "../exceptions/exception.root";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { User } from "../generated/prisma";
import { prismaClient } from "..";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. extract the token from header.
  const token: string = req.headers.authorization!;
  // 2. if the token is not present, throw an error of unauthorized.
  if (!token)
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  try {
    // 3. if the token is present, verify that token and extract the payload.
    const payload: any = jwt.verify(token, JWT_SECRET) as any;
    // 4. to get the user from the payload.
    const user: User | null = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user)
      next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    // 5. to attach the user to the current request object.
    else req.user = user; //  -> THERE WAS NOT ERROR! ANYMORE.

    // console.log("authMiddleware | req.body = " + req.body);
    next();
  } catch (err) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};
