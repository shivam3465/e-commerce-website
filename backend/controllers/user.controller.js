import { Users } from "../models/user.model.js";

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		let user = await Users.findOne({ email });

		if (user)
			res.status(400).json({
				success: false,
				message: "Previously registered user",
			});
		else {
			const hashedPassword = await bcrypt.hash(password, 10);
			user = await Users.create({
				name,
				email,
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
		res.status(400).json({ error: error.message, success: false });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// here due to select keyword in password we have to manually extract the password using +password and by default it will be not be there.
		let user = await Users.findOne({ email }).select("+password");

		if (user) {
			const matched = await bcrypt.compare(password, user.password);
			if (matched) {
				setCookies(
					res,
					user.id,
					`Welcom back ${user.name}`,
					200,
					1000 * 60 * 60
				);
			} else {
				res.status(401).json({
					success: false,
					message: "Wrong Password",
				});
			}
		} else {
			res.status(401).json({ success: false, message: "User Not Found" });
		}
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = (req, res) => {
	const { token } = req.cookies;

	if (!token) {
		res.status(400).json({ success: false, message: "Already logged out" });
	} else setCookies(res, "", "Logout Successfully", 200, 0);
};
