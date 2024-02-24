import express from "express";
import { getProductsBasedOnCategory } from "../controllers/product.controller.js";

const ProductRouter = express.Router();

ProductRouter.get("/products", getProductsBasedOnCategory);

export { ProductRouter };
