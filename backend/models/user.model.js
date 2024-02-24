import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
	{
		mainAddress: { type: String, required: true },
		city: { type: String, required: true },
		state: { type: String, required: true },
		country: { type: String, required: true },
		pinCode: { type: Number, required: true },
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
});

export const Users = mongoose.model("Users", UserSchema);
