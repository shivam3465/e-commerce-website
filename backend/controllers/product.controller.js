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

		res.status(400).json({
			success: true,
			message: "Products found successfully",
			products: products,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const getPopularProducts = async (req, res) => {
	try {
		//getting all the products with rating more than 4.8
		const products = await Products.find({ rating: { $gte: 4.8 } });

		res.status(200).json({
			success: true,
			message: "Products found successfully",
			products,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const getProductDetails = async (req, res) => {
	try {
		//getting all the products based on category and sub-category
		const { id } = req.params;
		const product = await Products.findOne({ productId: id });

		res.status(200).json({
			success: true,
			message: "Products found successfully",
			product,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
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

		res.status(200).json({
			success: true,
			message: "Products found successfully",
			products,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const getProductFromCart = async (req, res) => {
	try {
		const { user } = req; //user coming from middleware used for authentication

		const products = [];
		for (const currentProduct of user.productsInCart) {
			const Product = await Products.findById(currentProduct);
			if (Product) products.push(Product);
		}

		res.status(200).json({
			success: true,
			message: "Products in cart found successfully",
			data: products,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const addProductInCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const { user } = req; //user coming from middleware used for authentication

		if (!productId) {
			return res.status(400).json({
				success: false,
				message: "Product ID doesn't exists",
			});
		}
		const Product = await Products.findOne({ productId });

		if (!Product) {
			return res.status(400).json({
				success: false,
				message: "Product doesn't exists",
			});
		}

		//checking for the duplication in the productsInCart array
		const productFound = user.productsInCart.find((product) => {
			return product.equals(Product._id);
		});

		//Ignoring if it is already added
		if (productFound) {
			return res.status(400).json({
				success: false,
				message: "Product already added in cart",
			});
		}

		// adding product in cart and saving the updated user object
		user.productsInCart.push(Product._id);
		await user.save();

		res.status(200).json({
			success: true,
			message: "Product added successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const buyProduct = async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		const { user } = req; //user coming from middleware used for authentication

		if (!productId) {
			return res.status(400).json({
				success: false,
				message: "Product ID doesn't exists",
			});
		}
		if (!quantity || +quantity <= 0) {
			return res.status(400).json({
				success: false,
				message: "Product quantity cannot be zero",
			});
		}
		const Product = await Products.findOne({ productId });

		if (!Product) {
			return res.status(400).json({
				success: false,
				message: "Product doesn't exists",
			});
		}

		//checking for the availability of product in inventory
		if (Product.quantityAvailable < +quantity) {
			return res.status(400).json({
				success: false,
				message:
					"Requested quantity of this selected product is not available at the moment",
			});
		}

		// adding product in productsBought
		user.productsPurchased.push({
			product: Product._id,
			quantity: quantity,
			orderTime: new Date(),
		});
		await user.save();

		res.status(200).json({
			success: true,
			message: "Product purchased successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const buyProductFromCart = async (req, res) => {
	try {
		const { data } = req.body; // data will be an array of objects with productId and quantity as properties
		const { user } = req; //user coming from middleware used for authentication

		const UnAvailableProducts = [];
		for (const currentProduct of data) {
			if (!currentProduct.productId) {
				return res.status(400).json({
					success: true,
					message: "Product ID doesn't exists",
				});
			}
			if (!currentProduct.quantity || +currentProduct.quantity <= 0) {
				return res.status(400).json({
					success: true,
					message: "Product quantity cannot be zero",
				});
			}
			const Product = await Products.findOne({
				productId: currentProduct.productId,
			});

			if (!Product) {
				return res.status(400).json({
					success: true,
					message: "Product doesn't exists",
				});
			}

			//checking for the availability of product in inventory
			if (Product.quantityAvailable < +currentProduct.quantity) {
				UnAvailableProducts.push({
					productId: currentProduct.productId,
					availableQuantity: Product.quantityAvailable,
				});
			}
		}

		if (UnAvailableProducts.length > 0) {
			return res.status(400).json({
				success: false,
				message: "Following products are not available",
				notAvailableProducts: UnAvailableProducts,
			});
		}

		// If all products are available then subtracting the required quantities from available quantity and deleting from the cart
		for (const currentProduct of data) {
			const foundProduct = await Products.findOne({
				productId: currentProduct.productId,
			});

			if (foundProduct) {
				foundProduct.quantityAvailable -= +currentProduct.quantity;
				await foundProduct.save();

				// Adding product to productsBought array
				user.productsPurchased.push({
					product: foundProduct._id,
					quantity: currentProduct.quantity,
					orderTime: new Date(),
				});

				//deleting the product from the cart
				const updatedCart = user.productsInCart.filter((product) => {
					return !product.equals(foundProduct._id);
				});
				user.productsInCart = updatedCart;
			}
		}

		await user.save();

		res.status(200).json({
			success: true,
			message:
				"All the products from the carts had been purchased successfully ",
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export {
	getProductsBasedOnCategory,
	getPopularProducts,
	getProductDetails,
	handleSearchSuggestions,
	addProductInCart,
	buyProduct,
	buyProductFromCart,
	getProductFromCart,
};
