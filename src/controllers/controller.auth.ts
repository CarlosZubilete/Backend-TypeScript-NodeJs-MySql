import { Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import { JWT_SECRET, SALT_ROUNDS } from "../secrets";
import * as jwt from "jsonwebtoken";

// TODO: all async function have got inside try and catch

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (user) throw Error("User already exists!");

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, parseInt(SALT_ROUNDS)),
    },
  });

  res.status(200).json({ ok: true, name });
};

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
