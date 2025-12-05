const errorHandler = (err, req, res, next) => {

	console.log("error:", err);

	const status = err.statusCode || 500;
	const message = err.message || "Internal server error";

	return res.status(status).json({
		message,
		success: false
	});
};

export default errorHandler;