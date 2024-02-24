import jwt from "jsonwebtoken";

export const setCookies = (
	res,
	id = "",
	message,
	status_code = 200,
	time = 0
) => {
	const jwt_token = jwt.sign(id, process.env.SECRET_KEY);

	res.cookie("token", jwt_token, {
		expires: new Date(Date.now() + time),
		httpOnly: true,
		sameSite: "none",
		secure: true,
	});

	res.status(status_code).json({
		success: true,
		message,
	});
};
