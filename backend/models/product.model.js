import mongoose, { Schema } from "mongoose";
import { ReviewSchema } from "./review.model.js";

const productSchema = new Schema(
	{
		productId: {
			type: String,
			unique: true,
			required: true,
		},
		productName: String,
		productCategory: String,
		productSubcategory: String,
		productPrice: Number,
		rating: Number,
		quantityAvailable: Number,
		productImage: String,
		productSpecification: [], // will contain different properties as per product
		reviews: [ReviewSchema],
	},
	{ timestamps: true }
);

export const Products = mongoose.model("Products", productSchema);
