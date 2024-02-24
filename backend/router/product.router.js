import { Router } from "express";
import {
	getPopularProducts,
	getProductDetails,
	getProductsBasedOnCategory,
	handleSearchSuggestions,
} from "../controllers/product.controller.js";

const ProductRouter = Router();

ProductRouter.get("/products-by-category", getProductsBasedOnCategory);
ProductRouter.get("/popular-products", getPopularProducts);
ProductRouter.get("/product/:id", getProductDetails);

//for searching a product based on keywords
ProductRouter.get("/search", handleSearchSuggestions);

export { ProductRouter };
