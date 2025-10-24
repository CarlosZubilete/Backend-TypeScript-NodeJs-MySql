// import * as express from "express";
import { User } from "../generated/prisma";
import "express-serve-static-core";

// declare module "express-serve-static-core" {
//   interface Request {
//     user: User; // or the type you actually use
//   }
// }

// declare global {
//   namespace Express {
//     export interface Request {
//       user: User;
//     }
//   }
// }

// declare module "express" {
//   export interface Request {
//     user: User;
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export {};
