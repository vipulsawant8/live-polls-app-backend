import e, { json, urlencoded, static as static_ } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from "./routes/auth.routes.js";
import pollRoutes from "./routes/poll.routes.js";

import errorHandler from './middlewares/error/errorHandler.middleware.js';

const app = e();

const corsOptions = {
	origin: process.env.CORS_ORIGIN,
	methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
	credentials: true
};

const urlOptions = {
	limit: "50mb"
};

const jsonOptions = {
	limit: "50mb"
};

app.use(cors(corsOptions));

app.use(json(jsonOptions));
app.use(urlencoded(urlOptions));
app.use(static_("public"));

app.use(cookieParser());

app.use((req, _, next) => {
	
	console.log("req-method :", req.method);
	console.log("req-url :", req.url);
	next();
});

const apiRoute = '/api/v1';

app.use(`${apiRoute}/auth`, authRoutes);
app.use(`${apiRoute}/polls`, pollRoutes);

app.use(errorHandler);

export default app;