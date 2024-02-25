import jwt from "jsonwebtoken";
import { Users } from "../models/user.model.js";

const verifyAuthentication = async (req, res, next) => {
	try {
		const { token } = req.cookies;

		if (!token) {
			return res
				.status(202)
				.json({ success: false, message: "Login required to access the resource" });
		}

		const user = await Users.findById(
			jwt.verify(token, process.env.secret_key)
		);
		if (!user) {
			return res
				.status(202)
				.json({ success: false, message: "User not found" });
		}
		req.user = user;
		next();
	} catch (error) {
		res.status(404).json({
			success: false,
			message: error.message,
		});
	}
};

export { verifyAuthentication };
