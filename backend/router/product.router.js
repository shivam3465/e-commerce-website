import { Router } from "express";
import {
	addProductInCart,
	buyProduct,
	buyProductFromCart,
	getPopularProducts,
	getProductDetails,
	getProductFromCart,
	getProductsBasedOnCategory,
	handleSearchSuggestions,
} from "../controllers/product.controller.js";
import { verifyAuthentication } from "../middleware/auth.js";

const ProductRouter = Router();

ProductRouter.get("/products-by-category", getProductsBasedOnCategory);
ProductRouter.get("/popular-products", getPopularProducts);
ProductRouter.get("/product/:id", getProductDetails);

//for searching a product based on keywords
ProductRouter.get("/search", handleSearchSuggestions);

//add products in cart
ProductRouter.post("/add-to-cart", verifyAuthentication, addProductInCart);
ProductRouter.get("/get-product-from-cart", verifyAuthentication, getProductFromCart);
ProductRouter.post(
	"/buy-product-from-cart",
	verifyAuthentication,
	buyProductFromCart
);

//buy a particular product
ProductRouter.post("/buy-product", verifyAuthentication, buyProduct);

export { ProductRouter };
