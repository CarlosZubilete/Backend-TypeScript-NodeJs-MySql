import { Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync } from "bcrypt";
import { SALT_ROUNDS } from "../secrets";

export const login = (req: Request, res: Response) => {
  res.send("Login works");
};

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (user) throw Error("User already exists");

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, parseInt(SALT_ROUNDS || "10")),
    },
  });

  res.json(user);
};
