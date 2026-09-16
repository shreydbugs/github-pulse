import { addEvents } from './store.js';
import { resolveLocation } from './locationResolver.js';

let status = {
  status: 'ok', // 'ok', 'degraded', 'rate_limited', 'error'
  rateLimitRemaining: null,
  rateLimitReset: null,
  lastSuccessfulFetch: null,
};

// Simple cache for user locations to prevent spamming the API
const userLocationCache = new Map();
let pollInterval;

export function getGitHubStatus() {
  return status;
}

export function startPolling() {
  // Poll every 30 seconds to be gentle on public API without token,
  // or 10 seconds if we have a token.
  const intervalMs = process.env.GITHUB_TOKEN ? 10000 : 30000;
  
  console.log(`[Poller] Starting GitHub polling every ${intervalMs}ms...`);
  pollGitHub(); // initial poll
  pollInterval = setInterval(pollGitHub, intervalMs);
}

async function pollGitHub() {
  if (status.status === 'rate_limited' && status.rateLimitReset) {
    const now = Math.floor(Date.now() / 1000);
    if (now < status.rateLimitReset) {
      console.log(`[Poller] Waiting for rate limit reset at ${status.rateLimitReset}`);
      return;
    } else {
      status.status = 'ok';
    }
  }

  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Pulse-App'
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch('https://api.github.com/events', { headers });
    
    // Update rate limit info
    status.rateLimitRemaining = res.headers.get('x-ratelimit-remaining');
    status.rateLimitReset = res.headers.get('x-ratelimit-reset');

    if (res.status === 403 || res.status === 429) {
      console.warn(`[Poller] GitHub API Rate Limited. Remaining: ${status.rateLimitRemaining}`);
      status.status = 'rate_limited';
      return;
    }

    if (!res.ok) {
      throw new Error(`GitHub API returned ${res.status}`);
    }

    const events = await res.json();
    
    // Process and normalize
    const normalizedEvents = [];
    for (const event of events) {
      const type = event.type.replace('Event', '');
      const actor = event.actor?.login;
      const repository = event.repo?.name;
      const avatar = event.actor?.avatar_url;
      
      if (!actor || !repository) continue;

      let locationStr = userLocationCache.get(actor);
      
      // If we don't have it cached, fetch user profile (only if we have a token to avoid instant rate limiting)
      if (locationStr === undefined && process.env.GITHUB_TOKEN) {
        try {
          const userRes = await fetch(`https://api.github.com/users/${actor}`, { headers });
          if (userRes.ok) {
            const userData = await userRes.json();
            locationStr = userData.location || null;
            userLocationCache.set(actor, locationStr);
          } else {
            userLocationCache.set(actor, null);
          }
        } catch (e) {
          // ignore user fetch errors
          userLocationCache.set(actor, null);
        }
      } else if (locationStr === undefined) {
          // No token, skip user fetch to save limits
          userLocationCache.set(actor, null);
      }

      const location = locationStr ? resolveLocation(locationStr) : null;

      normalizedEvents.push({
        id: event.id,
        type,
        timestamp: event.created_at,
        actor,
        avatar,
        repository,
        location,
        url: `https://github.com/${repository}`,
      });
    }

    addEvents(normalizedEvents);
    status.status = 'ok';
    status.lastSuccessfulFetch = new Date().toISOString();

  } catch (error) {
    console.error(`[Poller] Error fetching events:`, error.message);
    if (status.status !== 'rate_limited') {
      status.status = 'degraded';
    }
  }
}
