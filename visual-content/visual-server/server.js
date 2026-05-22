import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

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
