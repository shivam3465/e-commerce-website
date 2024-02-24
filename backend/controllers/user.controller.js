import { Users } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { setCookies } from "../utils/setCookies.js";

export const register = async (req, res) => {
	try {
		const { userName, emailId, password } = req.body;
		let user = await Users.findOne({ emailId });

		if (user)
			res.status(400).json({
				success: false,
				message: "Already registered user",
			});
		else {
			const hashedPassword = await bcrypt.hash(password, 10);
			user = await Users.create({
				userName,
				emailId,
				password: hashedPassword,
			});

			setCookies(
				res,
				user.id,
				"Registered successfully",
				201,
				1000 * 60 * 60
			);
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { emailId, password } = req.body;

		// here due to select keyword in password we have to manually extract the password using +password and by default it will be not be there.
		let user = await Users.findOne({ emailId }).select("+password");

		if (user) {
			const matched = await bcrypt.compare(password, user.password);
			if (matched) {
				setCookies(
					res,
					user.id,
					`Welcome back ${user.userName}`,
					200,
					1000 * 60 * 60
				);
			} else {
				res.status(401).json({
					success: false,
					message: "Wrong Email or Password",
				});
			}
		} else {
			res.status(401).json({ success: false, message: "User Not Found" });
		}
	} catch (error) {
        console.log(error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = (req, res) => {
	const { token } = req.cookies;

	if (!token) {
		res.status(400).json({ success: false, message: "Already logged out" });
	} else setCookies(res, "", "Logout Successfully", 200, 0);
};
