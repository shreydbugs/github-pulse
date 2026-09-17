import { getState } from "../repository/store.js";
import { getGitHubStatus } from "../repository/githubRepository.js";

export function getHealth(req, res) {
  const ghStatus = getGitHubStatus();
  res.status(200).json({
    status: "ok",
    service: "github-pulse",
    timestamp: new Date().toISOString(),
    github: ghStatus,
  });
}

export function getPulseData(req, res) {
  const { hours = 24 } = req.query;
  const state = getState();

  // Basic filtering based on time window
  const cutoff = Date.now() - hours * 60 * 60 * 1000;

  const filteredEvents = state.events.filter(
    (e) => new Date(e.timestamp).getTime() > cutoff,
  );

  // Calculate stats based on filtered events
  const stats = {
    totalEvents: filteredEvents.length,
    activeRepositories: new Set(filteredEvents.map((e) => e.repository)).size,
    activeContributors: new Set(filteredEvents.map((e) => e.actor)).size,
    activeCountries: new Set(
      filteredEvents
        .filter((e) => e.location?.country)
        .map((e) => e.location.country),
    ).size,
  };

  // Aggregate locations for the globe
  const locationCounts = {};
  filteredEvents.forEach((e) => {
    if (e.location && e.location.coordinates) {
      const key = `${e.location.coordinates[0]},${e.location.coordinates[1]}`;
      if (!locationCounts[key]) {
        locationCounts[key] = {
          name: e.location.name,
          country: e.location.country,
          coordinates: e.location.coordinates,
          count: 0,
        };
      }
      locationCounts[key].count++;
    }
  });

  const locations = Object.values(locationCounts);

  // Top repositories
  const repoCounts = {};
  filteredEvents.forEach((e) => {
    if (!repoCounts[e.repository]) {
      repoCounts[e.repository] = {
        name: e.repository,
        count: 0,
        latestActivity: e.timestamp,
      };
    }
    repoCounts[e.repository].count++;
  });
  const topRepositories = Object.values(repoCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  res.status(200).json({
    status: getGitHubStatus().status,
    lastUpdated: state.lastUpdated,
    stats,
    locations,
    topRepositories,
    recentEvents: filteredEvents.slice(0, 50), // Send only 50 most recent for feed
  });
}
