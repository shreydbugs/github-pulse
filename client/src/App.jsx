import { useEffect, useState, useCallback } from "react";
import Globe from "./components/Globe";
import Feed from "./components/Feed";
import Stats from "./components/Stats";
import TopRepos from "./components/TopRepos";
import { RefreshCw, AlertCircle } from "lucide-react";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hours, setHours] = useState(24);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "";

  const fetchData = useCallback(
    async (isManual = false) => {
      if (isManual) setIsRefreshing(true);
      try {
        // In dev, use Vite proxy, in prod use absolute path or relative if served together
        const res = await fetch(`${API_URL}/api/pulse?hours=${hours}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (e) {
        console.error(e);
        // Keep previous data if available
        setError(
          "Unable to fetch latest data. Showing cached data if available.",
        );
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [hours],
  );

  useEffect(() => {
    setLoading(true);
    fetchData();
    const interval = setInterval(() => fetchData(), 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title">
          <h1>GitHub Pulse</h1>
          <p className="subtitle">Global GitHub activity visualization</p>
        </div>

        <div className="controls">
          <div className="time-filters">
            {[1, 6, 24].map((h) => (
              <button
                key={h}
                className={`filter-btn ${hours === h ? "active" : ""}`}
                onClick={() => setHours(h)}
              >
                {h}H
              </button>
            ))}
          </div>

          <div className="refresh-status">
            {data?.lastUpdated && (
              <span className="last-updated mono">
                Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
              </span>
            )}
            <button
              className={`refresh-btn ${isRefreshing ? "spinning" : ""}`}
              onClick={() => fetchData(true)}
              aria-label="Refresh data"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading && !data ? (
        <div className="loading-state">Loading GitHub activity...</div>
      ) : (
        <main className="main-content">
          <div className="left-panel">
            <Stats stats={data?.stats} />
            <TopRepos repos={data?.topRepositories} />
          </div>

          <div className="center-panel">
            <Globe locations={data?.locations || []} />
          </div>

          <div className="right-panel">
            <Feed events={data?.recentEvents || []} />
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
