// import * as express from "express";
import { User } from "../generated/prisma";

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}

// declare module "express" {
//   export interface Request {
//     user: User;
//   }
// }
