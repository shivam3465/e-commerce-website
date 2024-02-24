import { Products } from "../models/product.model.js";

const getProductsBasedOnCategory = async (req, res) => {
	try {
		//geting all the products based on category and sub-category
		const { category, subCategory } = req.query;
		const products = await Products.find({
			productCategory: category,
			productSubcategory: subCategory,
		});

		res.json({
			success: true,
			message: "Products found successfully",
			products: products,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};
const getPopularProducts = async (req, res) => {
	try {
		//geting all the products based on category and sub-category
		const { category, subCategory } = req.query;
		const products = await Products.find({
			productCategory: category,
			productSubcategory: subCategory,
		});

		res.json({
			success: true,
			message: "Products found successfully",
			products: products,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};
const getHighRatedProducts = async (req, res) => {
	try {
		//geting all the products based on category and sub-category
		const { category, subCategory } = req.query;
		const products = await Products.find({
			productCategory: category,
			productSubcategory: subCategory,
		});

		res.json({
			success: true,
			message: "Products found successfully",
			products: products,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export { getProductsBasedOnCategory, getPopularProducts, getHighRatedProducts };
