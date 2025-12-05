import { connect } from "mongoose";
// import Task from "../models/task.model.js";

const connectDB = async () => {

	try {
		const DB_CONNECT_STRING = process.env.DB_CONNECT_STRING;
		const DB_NAME = process.env.DB_NAME;
	
		const DB_PATH = `${DB_CONNECT_STRING}/${DB_NAME}`;
	
		console.log('dbPath :', DB_PATH);

		const conn = await connect(DB_PATH);
	
		console.log('MongoDB connected');

		const connection = conn.connection;
		
		console.log('readyState :', connection.readyState);
		console.log('host :', connection.host);
		console.log('DB_NAME :', connection.name);
		console.log('collections', Object.keys(connection.collections));

		// await Task.syncIndexes();
	} catch (error) {
		
		console.log("Error :", error);
		process.exit(1);
	}
};

export default connectDB;