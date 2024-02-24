import mongoose from "mongoose";

const connectToDatabase = async () => {
	try {
		const { DATABASE_URI } = process.env;
		await mongoose.connect(DATABASE_URI, {
			dbName: "e-commerce",
		});
		console.log("Database connected successfully");
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
};

export { connectToDatabase };
