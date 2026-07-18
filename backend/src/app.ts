import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import vehiclesRoutes from "./modules/vehicles/vehicles.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehiclesRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Global Error Handler
app.use(errorHandler);

export default app;
