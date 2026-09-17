const cityMap = {
  "san francisco": {
    lat: 37.7749,
    lon: -122.4194,
    country: "United States",
    name: "San Francisco",
  },
  "new york": {
    lat: 40.7128,
    lon: -74.006,
    country: "United States",
    name: "New York",
  },
  nyc: {
    lat: 40.7128,
    lon: -74.006,
    country: "United States",
    name: "New York",
  },
  london: {
    lat: 51.5074,
    lon: -0.1278,
    country: "United Kingdom",
    name: "London",
  },
  berlin: { lat: 52.52, lon: 13.405, country: "Germany", name: "Berlin" },
  paris: { lat: 48.8566, lon: 2.3522, country: "France", name: "Paris" },
  tokyo: { lat: 35.6762, lon: 139.6503, country: "Japan", name: "Tokyo" },
  beijing: { lat: 39.9042, lon: 116.4074, country: "China", name: "Beijing" },
  shanghai: { lat: 31.2304, lon: 121.4737, country: "China", name: "Shanghai" },
  bangalore: {
    lat: 12.9716,
    lon: 77.5946,
    country: "India",
    name: "Bangalore",
  },
  bengaluru: {
    lat: 12.9716,
    lon: 77.5946,
    country: "India",
    name: "Bangalore",
  },
  mumbai: { lat: 19.076, lon: 72.8777, country: "India", name: "Mumbai" },
  pune: { lat: 18.5204, lon: 73.8567, country: "India", name: "Pune" },
  seattle: {
    lat: 47.6062,
    lon: -122.3321,
    country: "United States",
    name: "Seattle",
  },
  austin: {
    lat: 30.2672,
    lon: -97.7431,
    country: "United States",
    name: "Austin",
  },
  sydney: {
    lat: -33.8688,
    lon: 151.2093,
    country: "Australia",
    name: "Sydney",
  },
  melbourne: {
    lat: -37.8136,
    lon: 144.9631,
    country: "Australia",
    name: "Melbourne",
  },
  toronto: { lat: 43.651, lon: -79.347, country: "Canada", name: "Toronto" },
  vancouver: {
    lat: 49.2827,
    lon: -123.1207,
    country: "Canada",
    name: "Vancouver",
  },
  singapore: {
    lat: 1.3521,
    lon: 103.8198,
    country: "Singapore",
    name: "Singapore",
  },
  amsterdam: {
    lat: 52.3676,
    lon: 4.9041,
    country: "Netherlands",
    name: "Amsterdam",
  },
  "sao paulo": {
    lat: -23.5505,
    lon: -46.6333,
    country: "Brazil",
    name: "Sao Paulo",
  },
  lagos: { lat: 6.5244, lon: 3.3792, country: "Nigeria", name: "Lagos" },
  "tel aviv": {
    lat: 32.0853,
    lon: 34.7818,
    country: "Israel",
    name: "Tel Aviv",
  },
  dubai: {
    lat: 25.2048,
    lon: 55.2708,
    country: "United Arab Emirates",
    name: "Dubai",
  },
  seoul: { lat: 37.5665, lon: 126.978, country: "South Korea", name: "Seoul" },
  madrid: { lat: 40.4168, lon: -3.7038, country: "Spain", name: "Madrid" },
  barcelona: { lat: 41.3851, lon: 2.1734, country: "Spain", name: "Barcelona" },
  // Country fallbacks
  india: { lat: 20.5937, lon: 78.9629, country: "India", name: "India" },
  usa: {
    lat: 37.0902,
    lon: -95.7129,
    country: "United States",
    name: "United States",
  },
  "united states": {
    lat: 37.0902,
    lon: -95.7129,
    country: "United States",
    name: "United States",
  },
  uk: {
    lat: 55.3781,
    lon: -3.436,
    country: "United Kingdom",
    name: "United Kingdom",
  },
  germany: { lat: 51.1657, lon: 10.4515, country: "Germany", name: "Germany" },
  france: { lat: 46.2276, lon: 2.2137, country: "France", name: "France" },
  china: { lat: 35.8617, lon: 104.1954, country: "China", name: "China" },
  japan: { lat: 36.2048, lon: 138.2529, country: "Japan", name: "Japan" },
  brazil: { lat: -14.235, lon: -51.9253, country: "Brazil", name: "Brazil" },
};

export function resolveLocation(locationStr) {
  if (!locationStr || typeof locationStr !== "string") return null;

  const normalized = locationStr.toLowerCase().trim();

  // Try exact match
  if (cityMap[normalized]) {
    return {
      ...cityMap[normalized],
      coordinates: [cityMap[normalized].lat, cityMap[normalized].lon],
    };
  }

  // Try partial match (e.g. "Pune, India" -> "pune")
  for (const [key, data] of Object.entries(cityMap)) {
    if (normalized.includes(key)) {
      return { ...data, coordinates: [data.lat, data.lon] };
    }
  }

  return null;
}
