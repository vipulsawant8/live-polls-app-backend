const setCookieOptions = name => {

	const isProd = process.env.NODE_ENV === "production";
	console.log("isProd :", isProd);
	const base = {
		secure: true,
		httpOnly: isProd,
		sameSite: isProd ? "none" : "lax"
	};

	const config = {
		accessToken: {
			...base,
			maxAge: 30 * 60 * 1000
		},
		refreshToken: {
			...base,
			maxAge: 15 * 24 * 60 * 60 * 1000
		}
	 };

	return config[name] || null;
};

export { setCookieOptions };