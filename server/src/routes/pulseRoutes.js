import { getPulseData, getHealth } from "../controllers/pulseController.js";

export function setupRoutes(app) {
  app.get("/health", getHealth);
  app.get("/api/pulse", getPulseData);
}
