import jwt from "jsonwebtoken";

import pollReceiver from "./receivers/pollReceiver.js";
import { parseCookie } from "cookie";

const socketHandler = (io) => {

	io.use((socket, next) => {

		const cookieHeader =  socket.handshake.headers.cookie || "";
		// console.log("cookieHeader :", cookieHeader);

		const cookies = parseCookie(cookieHeader);
		const accessToken = cookies.accessToken;
		
		// console.log("accessToken :", accessToken);

		if (!accessToken) {
			socket.userID = null;
			return next();
		}

		try {
			
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			console.log("decoded :", decoded);
			socket.userID = decoded.id;
		} catch (error) {
			
			socket.userID = null;
		}

		next();
	});

	io.on('connection', (socket) => {

		pollReceiver(io, socket);
	});
};

export default socketHandler;