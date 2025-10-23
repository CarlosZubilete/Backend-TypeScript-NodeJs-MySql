import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import { JWT_SECRET, SALT_ROUNDS } from "../secrets";
import jwt from "jsonwebtoken";
import { BadRequestException } from "../exceptions/exception.bad-request";
import { ErrorCode } from "../exceptions/exception.root";
import { schemaSignup } from "../schema/schema.signup";
import { NotFoundException } from "../exceptions/exception.not-found";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  schemaSignup.parse(req.body);
  const { name, email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    next(
      new BadRequestException(
        "User already exists!",
        ErrorCode.USER_ALREADY_EXISTS
      )
    );
  }
  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, parseInt(SALT_ROUNDS)),
    },
  });
  res.status(200).json({ ok: true, name });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user)
    throw new NotFoundException(
      "User does not exists!",
      ErrorCode.USER_NOT_FOUND
    );

  if (!compareSync(password, user.password))
    throw new BadRequestException(
      "Incorrect password!",
      ErrorCode.INCORRECT_PASSWORD
    );

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ userId: user.id, token });
};

export const me = async (req: Request, res: Response) => {
  res.status(200).json(req.body);
};
