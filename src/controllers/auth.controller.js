import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { setCookieOptions } from "../constants.js";

import jwt from 'jsonwebtoken';

const generateAccessRefreshToken = async (id) => {

	const user = await User.findById(id);
	if (!user) throw new ApiError(404, "User not found");

	const accessToken = await user.generateAccessToken();
	const refreshToken = await user.generateRefreshToken();
	user.refreshToken = refreshToken;
	await user.save({ validateBeforeSave: false });


	const tokens = { accessToken, refreshToken };
	console.log('refreshToken from tokens:', tokens.refreshToken, "refreshToken from user :", user.refreshToken);
	return tokens;
};

const registerUser = asyncHandler( async (req, res) => {

	console.log("registerUser Handler");
	console.log("req.body :", req.body);

	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password;

	if (!email || !name || !password) throw new ApiError(400, 'Please fill all fields');

	const user = await User.findOne({ email });
	if (user) throw new ApiError(400, 'E-mail is already registred');

	const newUser = await User.create({ email, password, name });
	// newUser.password = undefined;

	const response = { message: "User registred", data: newUser, success: true };
	return res.status(200).json(response);
} );

const loginUser = asyncHandler( async (req, res) => {

	console.log("loginUser controller");
	console.log("req.body :", req.body);

	const identity = req.body.identity;
	const password = req.body.password;

	if (!identity || !password) throw new ApiError(400, "Kindly fill all fields");

	const validUser = await User.findOne({ email: identity }).select("-refreshToken");

	if (!validUser) throw new ApiError(401, "Invaid Credentials");

	console.log('validUser :', validUser);

	const isPasswordVerified = await validUser.verifyPassword(password);

	if (!isPasswordVerified) throw new ApiError(401, "Invaid Credentials");

	const { accessToken, refreshToken } = await generateAccessRefreshToken(validUser._id);

	// validUser.password = undefined;

	const response = { message: "User logged-in successfully", data: { user: validUser, accessToken }, success: true };

	return res.status(200)
	.cookie('accessToken', accessToken, setCookieOptions('accessToken'))
	.cookie('refreshToken', refreshToken, setCookieOptions('refreshToken'))
	.json(response);
} );

const logoutUser = asyncHandler( async (req, res) => {

	const user = req.user;

	await User.findByIdAndUpdate(user._id, { $set: { refreshToken: null } });

	const response = { message: "User logged-out successfully", success: true };

	return res.status(200)
	.clearCookie('accessToken')
	.clearCookie('refreshToken')
	.json(response);
} );

const getMe = asyncHandler( async (req, res) => {

	const user = req.user;
	
	const response = { message: "User fetched", data: user };

	return res.status(200).json(response);
} );

const refreshAccessToken = asyncHandler( async (req, res) => {

	console.log("refresh controller");
	console.log("req.body :", req.body);

	const incomingToken = req.cookies.refreshToken;
	console.log('incomingToken :', incomingToken);
	if (!incomingToken)  throw new ApiError(400, "Refresh token missing");
	
	const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

	const validUser = await User.findById(decodedToken.id);
	console.log('validUser :', validUser);

	if (incomingToken !== validUser.refreshToken) throw new ApiError(401, "In-valid refreshToken");
	const { accessToken, refreshToken } = await generateAccessRefreshToken(validUser._id);

	console.log("user :", validUser);

	const response = { message: "User logged-in successfully", data: { user: validUser, accessToken }, success: true };

	return res.status(200)
	.cookie('accessToken', accessToken, setCookieOptions('accessToken'))
	.cookie('refreshToken', refreshToken, setCookieOptions('refreshToken'))
	.json(response);
} );

export { registerUser, loginUser, logoutUser, getMe, refreshAccessToken }; 