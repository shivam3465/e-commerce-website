import mongoose, { Schema } from "mongoose";

export const ReviewSchema = new Schema({
	userName: String,
	userId: { type: Schema.Types.ObjectId, ref: 'Users' }, // Reference to the User model
	review: String,
});

export const Reviews = mongoose.model("Review", ReviewSchema);
