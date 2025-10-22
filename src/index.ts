import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes/routes.index";
import { PrismaClient } from "./generated/prisma";

const app: Express = express();
// Middleware
app.use(express.json());

app.use("/api", rootRouter);

export const prismaClient: PrismaClient = new PrismaClient({
  log: ["query"],
});

app.listen(PORT, () => {
  console.log("We're listening on http://localhost:3000");
});
