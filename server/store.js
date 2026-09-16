// In-memory store for normalized GitHub events
// For production scale, use Redis or a DB, but for this requirement, in-memory is required to keep it simple.

let state = {
  events: [],
  lastUpdated: null,
};

// Maximum events to keep in memory to avoid OOM
const MAX_EVENTS = 10000;

export function addEvents(newEvents) {
  // Deduplicate and insert
  const existingIds = new Set(state.events.map(e => e.id));
  const uniqueNew = newEvents.filter(e => !existingIds.has(e.id));
  
  if (uniqueNew.length > 0) {
    state.events = [...uniqueNew, ...state.events].slice(0, MAX_EVENTS);
    state.lastUpdated = new Date().toISOString();
  }
}

export function getState() {
  return state;
}
