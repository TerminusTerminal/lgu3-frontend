import React, { useEffect, useState } from "react";
import api from "../api";
import "./Reports.css";

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [summaries, setSummaries] = useState({}); // store AI summaries per key
  const [summarizing, setSummarizing] = useState({}); // track loading per key

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await api.get("/reports/summary");
      setData(r.data);
    } catch (err) {
      console.error(err);
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

  const filteredData = data
    ? Object.keys(data)
        .filter(key => key.toLowerCase().includes(filter.toLowerCase()))
        .reduce((obj, key) => {
          obj[key] = data[key];
          return obj;
        }, {})
    : {};

  return (
    <div className="page">
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

      {loading && <p className="loading">Loading reports...</p>}

      {!loading && data && Object.keys(filteredData).length === 0 && (
        <p className="empty">No matching reports.</p>
      )}

      <div className="reports-cards">
        {data &&
          Object.entries(filteredData).map(([key, value]) => (
            <div className="report-card" key={key}>
              <h3>{key.replace(/_/g, " ").toUpperCase()}</h3>
              {typeof value === "number" || typeof value === "string" ? (
                <p className="report-value">{value}</p>
              ) : (
                <pre className="report-json">{JSON.stringify(value, null, 2)}</pre>
              )}

              <button
                onClick={() => handleSummarize(key, value)}
                disabled={summarizing[key]}
                style={{ marginTop: "8px" }}
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
          ))}
      </div>
    </div>
  );
}
