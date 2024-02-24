//configuration for environment variables
import { config } from "dotenv";
config({
	path: "./config.env",
});

import { app } from "./app.js";
import cors from "cors";
import { connectToDatabase } from "./data/database.js";

await connectToDatabase();

//allowing cors to localhost url
app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

const { PORT } = process.env;
app.listen(PORT, () => {
	console.log("Server listening on port : ", PORT);
});
