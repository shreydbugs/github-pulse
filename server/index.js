import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { setupRoutes } from "./routes.js";
import { startPolling } from "./githubPoller.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  }),
);
app.use(express.json());

// Routes
setupRoutes(app);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Server Error]", err);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`[Server] GitHub Pulse API listening on port ${PORT}`);
  // Start polling GitHub data on boot
  startPolling();
});
