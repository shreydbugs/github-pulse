import { Clock } from 'lucide-react';

function getRelativeTime(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatEventType(type) {
  const map = {
    'Push': 'pushed to',
    'PullRequest': 'opened a pull request in',
    'Issues': 'opened an issue in',
    'IssueComment': 'commented in',
    'Create': 'created',
    'Delete': 'deleted',
    'Watch': 'starred',
    'Fork': 'forked',
    'Release': 'published a release in',
    'Public': 'made public'
  };
  return map[type] || 'interacted with';
}

function Feed({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="panel-section">
        <h2 className="section-title">Live Feed</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent activity to display.</p>
      </div>
    );
  }

  return (
    <div className="panel-section">
      <h2 className="section-title">Live Feed</h2>
      <div className="feed-list">
        {events.map(event => (
          <div key={event.id} className="feed-item">
            <img 
              src={event.avatar || `https://github.com/${event.actor}.png?size=64`} 
              alt={event.actor} 
              className="feed-avatar"
              onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDMiAyIDEyIDEyIDEyIDEyeiIvPjwvc3ZnPg=='; }}
            />
            <div className="feed-content">
              <div className="feed-text">
                <span className="feed-actor">{event.actor}</span>
                {' '}
                <span style={{ color: 'var(--text-muted)' }}>{formatEventType(event.type)}</span>
                {' '}
                <a href={event.url} target="_blank" rel="noreferrer" className="feed-repo">
                  {event.repository.split('/')[1] || event.repository}
                </a>
              </div>
              <div className="feed-meta">
                <Clock size={12} />
                <span>{getRelativeTime(event.timestamp)}</span>
                {event.location?.name && (
                  <>
                    <span style={{ margin: '0 4px', opacity: 0.5 }}>•</span>
                    <span>{event.location.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
