import { Activity, GitCommit, Users, MapPin } from 'lucide-react';

const formatNum = (num) => new Intl.NumberFormat().format(num || 0);

function Stats({ stats }) {
  if (!stats) return null;

  return (
    <div className="panel-section">
      <h2 className="section-title">Global Stats</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <Activity size={16} className="stat-icon" />
          <div className="stat-value mono">{formatNum(stats.totalEvents)}</div>
          <div className="stat-label">Events</div>
        </div>
        <div className="stat-card">
          <GitCommit size={16} className="stat-icon" />
          <div className="stat-value mono">{formatNum(stats.activeRepositories)}</div>
          <div className="stat-label">Repositories</div>
        </div>
        <div className="stat-card">
          <Users size={16} className="stat-icon" />
          <div className="stat-value mono">{formatNum(stats.activeContributors)}</div>
          <div className="stat-label">Contributors</div>
        </div>
        <div className="stat-card">
          <MapPin size={16} className="stat-icon" />
          <div className="stat-value mono">{formatNum(stats.activeCountries)}</div>
          <div className="stat-label">Countries</div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
