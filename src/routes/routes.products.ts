import { Router } from "express";
import { errorHandler } from "../error-handler";
import { createProduct } from "../controllers/controller.products";
import { authMiddleware } from "../middlewares/middleware.auth";
import { adminMiddleware } from "../middlewares/middleware.admin";

const productsRoutes: Router = Router();

productsRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);

export default productsRoutes;
