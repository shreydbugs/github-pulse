# GitHub Pulse

GitHub Pulse is a near-real-time visualization of public GitHub activity around the world. It provides a beautiful 3D globe visualization of developer activity, aggregating events to give a macro view of the open-source ecosystem.

## Architecture

The application is split into two parts:
- **Backend (Node.js/Express)**: Polls the GitHub API, normalizes events, resolves locations, and handles rate limiting. It acts as an in-memory cache to prevent clients from directly hammering GitHub.
- **Frontend (React/Vite)**: A lightweight, performant UI that consumes the normalized API. It uses `cobe` for the 3D globe visualization.

## Tech Stack
- Frontend: React, Vite, COBE (WebGL Globe), Lucide React (Icons)
- Backend: Node.js, Express, Helmet, node-fetch (native)

## Location Resolution
GitHub events do not include precise coordinates. The backend resolves user profile locations using a lightweight internal geocoding map of major tech hubs and countries. If a location cannot be resolved safely, it is omitted from the globe but retained in global statistics.

## Environment Variables
See `.env.example`.
- `GITHUB_TOKEN` (Optional but highly recommended): Increases your API rate limit.
- `PORT` (Optional): Backend port (default 3001).

## Getting Started

1. `npm run install:all`
2. `npm run dev` (starts both client on 3000 and server on 3001)

## Building for Production

1. `npm run build`
2. Start the server: `cd server && npm start`
(Note: You will need to serve the static frontend files via a CDN or configure Express to serve the `/client/dist` folder).

## Limitations
- GitHub's public events stream is massive; this app samples the stream based on the polling interval.
- Location data relies on public user profile strings and is approximate.
