import "./StatsPanel.css";

function StatsPanel({ entries }) {
    const locationCounts = entries.reduce((acc, e) => {
      acc[e.location] = (acc[e.location] || 0) + 1;
      return acc;
    }, {});
    const mostCommon = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  
    return (
      <div className="stats-container">
        <h3>Visitor Stats</h3>
        <p>Total Visitors: {entries.length}</p>
        <h4>Top Locations:</h4>
        <ul>
          {mostCommon.map(([loc, count]) => (
            <li key={loc}>{loc} — {count}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default StatsPanel;
  