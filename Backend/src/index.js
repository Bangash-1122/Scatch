import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});

import connectDB from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.error("Express App Error:", error);
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📡 Healthcheck: http://localhost:${PORT}/api/v1/healthcheck`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed!", err);
        // Start app in offline / demo mode so frontend can still connect or inspect health
        app.listen(PORT, () => {
            console.log(`⚠️ Server running without database on http://localhost:${PORT}`);
        });
    });