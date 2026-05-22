import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load Environment Variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create local uploads directory if it doesn't exist (for fallback)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads/ directory for local fallback storage.");
}

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });

    // Handle Graceful Shutdown / Unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
