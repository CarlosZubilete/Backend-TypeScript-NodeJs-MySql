import { Router } from "express";
import { login, signup } from "../controllers/controller.auth";

const authRoutes: Router = Router();

authRoutes.get("/login", login);
authRoutes.post("/signup", signup);

export default authRoutes;
