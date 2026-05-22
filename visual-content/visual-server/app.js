import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

// Route imports (to be implemented)
import authRoutes from "./routes/authRoutes.js";
import pinRoutes from "./routes/pinRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Middleware imports
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers (configured to allow cross-origin resource sharing of images if needed)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Compression for network efficiency
app.use(compression());

// Logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// CORS Config
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Static folder for local uploads fallback
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Base Routes
app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/users", userRoutes);

// Basic health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// 404 & Error Handler Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
