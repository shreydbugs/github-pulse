function TopRepos({ repos }) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="panel-section">
      <h2 className="section-title">Trending Repositories</h2>
      <div className="repo-list">
        {repos.map((repo, i) => (
          <div key={repo.name} className="repo-item">
            <div className="repo-info">
              <a 
                href={`https://github.com/${repo.name}`} 
                target="_blank" 
                rel="noreferrer" 
                className="repo-name"
                title={repo.name}
              >
                {i + 1}. {repo.name.split('/')[1] || repo.name}
              </a>
              <span className="repo-activity">
                {repo.name.split('/')[0]}
              </span>
            </div>
            <div className="repo-count mono">
              {repo.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopRepos;
