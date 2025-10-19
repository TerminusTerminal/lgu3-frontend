import React, { useEffect, useState } from "react";
import api from "../api";
import "./Reports.css";

export default function Reports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [summaries, setSummaries] = useState({});
  const [summarizing, setSummarizing] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await api.get("/reports/summary");
      setData(r.data ?? []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async (key, value) => {
    setSummarizing(prev => ({ ...prev, [key]: true }));
    try {
      const textToSummarize =
        typeof value === "object" ? JSON.stringify(value, null, 2) : value.toString();

      const res = await api.post("/reports/summarize", { text: textToSummarize });
      setSummaries(prev => ({ ...prev, [key]: res.data?.text || "No summary returned." }));
    } catch (err) {
      console.error("Error summarizing report:", err);
      setSummaries(prev => ({ ...prev, [key]: "Failed to summarize." }));
    } finally {
      setSummarizing(prev => ({ ...prev, [key]: false }));
    }
  };

  if (loading) return <p className="loading">Loading reports...</p>;
  if (!data || data.length === 0) return <p className="empty">No report data available.</p>;

  return (
    <div className="page reports-page">
      <h2>Reports</h2>

      <div className="reports-actions">
        <input
          type="text"
          placeholder="Filter reports..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <button onClick={fetchData}>Refresh</button>
      </div>

      <div className="reports-cards">
        {Array.isArray(data) ? (
          data
            .filter(item => !filter || item.status.toLowerCase().includes(filter.toLowerCase()))
            .map(item => (
              <div className="report-card" key={item.status}>
                <h3>Status Summary</h3>
                <span className={`status-badge ${item.status.toLowerCase()}`}>
                  {item.status}: {item.total}
                </span>
              </div>
            ))
        ) : (
          Object.entries(data)
            .filter(([key]) => key.toLowerCase().includes(filter.toLowerCase()))
            .map(([key, value]) => (
              <div className="report-card" key={key}>
                <h3>{key.replace(/_/g, " ").toUpperCase()}</h3>

                {typeof value === "object" ? (
                  <pre className="report-json">{JSON.stringify(value, null, 2)}</pre>
                ) : (
                  <p className="report-value">{value}</p>
                )}

                <button
                  onClick={() => handleSummarize(key, value)}
                  disabled={summarizing[key]}
                >
                  {summarizing[key] ? "Summarizing..." : "Summarize"}
                </button>

                {summaries[key] && (
                  <div className="report-summary">
                    <strong>AI Summary:</strong>
                    <p>{summaries[key]}</p>
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}
