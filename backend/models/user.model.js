import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
	{
		mainAddress: { type: String },
		city: { type: String },
		state: { type: String },
		country: { type: String },
		pinCode: { type: Number },
	},
	{ _id: false }
);

const UserSchema = new Schema({
	userName: { type: String, required: true },
	emailId: { type: String, required: true },
	password: { type: String, required: true, select: false },
	phoneNumber: String,
	address: AddressSchema,
	favorites: [{ type: Schema.Types.ObjectId, ref: "Products" }],
	productsInCart: [{ type: Schema.Types.ObjectId, ref: "Products" }],
	productsPurchased: [
		{
			product: {
				type: Schema.Types.ObjectId,
				ref: "Products",
				required: true,
			},
			quantity: { type: Number, required: true },
			orderTime: { type: Date, default: Date.now, required: true },
			deliveryStatus: {type: String, default: "UNDER-PROCESSING"},
			deliveryTime: {type: Date, default: null}
		},
	],
});

export const Users = mongoose.model("Users", UserSchema);
