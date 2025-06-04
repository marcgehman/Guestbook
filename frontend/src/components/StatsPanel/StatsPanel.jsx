import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import "./StatsPanel.css";

// Simple function to extract US state from location string
function extractState(location) {
  const parts = location.split(", ");
  if (parts.length === 3 && parts[2] === "United States") {
    return parts[1]; // the state
  }
  return "Other";
}

function StatsPanel({ entries }) {
  const total = entries.length;

  // Aggregate counts by state
  const stateCounts = entries.reduce((acc, entry) => {
    const state = extractState(entry.location);
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(stateCounts).map(([state, count]) => ({
    state,
    count,
  }));


  /* 
    Custom color scale functions for the bars.
  */
  const colorScale = (count, max) => {
    const intensity = Math.round((count / max) * 180 + 50); // range 50–230
    return `rgb(${123}, ${30}, ${intensity})`; // burgundy gradient
  };
  function stringToHSL(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 60%)`;
  }
  

  return (
    <div className="stats-container">
      <h2>Visitor Stats</h2>
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Total Visitors</span>
            <span className="kpi-value">{total}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Unique Locations</span>
            <span className="kpi-value">{Object.keys(stateCounts).length}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Most Active State</span>
            <span className="kpi-value">
              {chartData.length > 0 ? chartData[0].state : "—"}
            </span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Most Recent Visit</span>
            <span className="kpi-value">
              {entries.length > 0
                ? new Date(
                    Math.max(...entries.map((e) => new Date(e.timestamp)))
                  ).toLocaleString()
                : "—"}
            </span>
          </div>
      </div>
      <h4>Top Locations by State</h4>
      <div style={{ height: "250px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData.sort((a, b) => b.count - a.count)}
            margin={{ top: 10, right: 20, bottom: 10, left: 40 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="state" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="#7B1E3B">
              {chartData.map((entry, index) => {
                const baseHue = Math.abs(
                  [...entry.state].reduce((acc, char) => acc + char.charCodeAt(0), 0)
                ) % 360;
                const lightness = 80 - Math.min(entry.count * 5, 40); // 40–80%
                const fill = `hsl(${baseHue}, 70%, ${lightness}%)`;
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}
          </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatsPanel;
