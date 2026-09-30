import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

        // Handle URI formatting with DB_NAME and query parameters safely
        let targetUri;
        if (uri.includes("?")) {
            const [base, query] = uri.split("?");
            const cleanBase = base.replace(/\/+$/, "");
            const parts = cleanBase.split("/");
            if (parts.length <= 3) {
                targetUri = `${cleanBase}/${DB_NAME}?${query}`;
            } else {
                targetUri = `${cleanBase}?${query}`;
            }
        } else {
            const cleanBase = uri.replace(/\/+$/, "");
            const parts = cleanBase.split("/");
            if (parts.length <= 3) {
                targetUri = `${cleanBase}/${DB_NAME}`;
            } else {
                targetUri = cleanBase;
            }
        }

        const connectionInstance = await mongoose.connect(targetUri);
        console.log(`\n☘️  MongoDB connected! DB HOST: ${connectionInstance.connection.host}, DB NAME: ${connectionInstance.connection.name}`);
        return connectionInstance;
    } catch (error) {
        console.error("❌ MongoDB connection FAILED:", error.message || error);
        // Do not immediately kill process so that developers can see friendly error diagnostics
        throw error;
    }
};

export default connectDB;