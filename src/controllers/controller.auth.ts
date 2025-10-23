import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import { JWT_SECRET, SALT_ROUNDS } from "../secrets";
//import * as jwt from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { BadRequestException } from "../exceptions/exception.bad-request";
import { ErrorCode } from "../exceptions/exception.root";
import { UnprocessableEntity } from "../exceptions/exception.validation";
import { schemaSignup } from "../schema/schema.signup";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
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
  // } catch (err: any) {
  //   next(
  //     new UnprocessableEntity(
  //       "Unprocessable entity",
  //       ErrorCode.UNPROCESSABLE_ENTITY,
  //       err?.issues
  //     )
  //   );
  // }
};

// TODO: all async function have got inside try and catch
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) throw Error("User does not exists!");

  if (!compareSync(password, user.password)) throw Error("Incorrect password!");

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
};
