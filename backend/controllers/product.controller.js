import { Products } from "../models/product.model.js";

const getProductsBasedOnCategory = async (req, res) => {
	try {
		//getting all the products based on category and sub-category
		const { category, subCategory } = req.query;

		const query = {};

		//conditionally adding the category and sub-category if they exists
		if (category) query.productCategory = category;
		if (subCategory) query.productSubcategory = subCategory;

		const products = await Products.find(query);

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
		//getting all the products with rating more than 4.8
		const products = await Products.find({ rating: { $gte: 4.8 } });

		res.json({
			success: true,
			message: "Products found successfully",
			products,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

const getProductDetails = async (req, res) => {
	try {
		//getting all the products based on category and sub-category
		const { id } = req.params;
		const product = await Products.findOne({ productId: id });

		res.json({
			success: true,
			message: "Products found successfully",
			product,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

const handleSearchSuggestions = async (req, res) => {
	try {
		const { query } = req.query;
		// getting all the products which contains the following keyword
		const products = await Products.find({
			$or: [
				{ productName: { $regex: new RegExp(query, "i") } },
				{ productCategory: { $regex: new RegExp(query, "i") } },
				{ productSubcategory: { $regex: new RegExp(query, "i") } },
			],
		}).limit(10);

		res.json({
			success: true,
			message: "Products found successfully",
			products,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export {
	getProductsBasedOnCategory,
	getPopularProducts,
	getProductDetails,
	handleSearchSuggestions,
};
