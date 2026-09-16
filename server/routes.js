import { getPulseData, getHealth } from "./controllers.js";

export function setupRoutes(app) {
  app.get("/health", getHealth);
  app.get("/api/pulse", getPulseData);
}
