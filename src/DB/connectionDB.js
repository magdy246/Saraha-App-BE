import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
dotenv.config({path:path.resolve("config/.env")});
const connectionDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.URL_CONNECTION_ONLINE_DB,
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
    }
};

export default connectionDB;