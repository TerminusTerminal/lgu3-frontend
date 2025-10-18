import React, { useEffect, useState } from "react";
import api from "../api";
import "./Applications.css";

export default function Applications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const r = await api.get("/applications");
        setList(Array.isArray(r.data.data ?? r.data) ? (r.data.data ?? r.data) : []);
      } catch (err) {
        console.error("Failed to load applications", err);
        setList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const decide = async (id, action) => {
    try {
      await api.post(`/applications/${id}/decide`, {
        action,
        remarks: action === "approve" ? "Approved" : "Rejected",
      });
      const r = await api.get("/applications");
      setList(r.data.data ?? r.data);
    } catch (err) {
      console.error("Failed to decide", err);
    }
  };

  if (loading) return <div className="page"><p>Loading applications...</p></div>;
  if (!list.length) return <div className="page"><p>No applications found.</p></div>;

  return (
    <div className="page">
      <h2>Applications</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Investor</th>
            <th>Project</th>
            <th>Incentive</th>
            <th>Requested</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.investor?.name ?? a.investor_id ?? "-"}</td>
              <td>{a.project?.name ?? a.project_id ?? "-"}</td>
              <td>{a.incentive?.title ?? a.incentive_id ?? "-"}</td>
              <td>{a.requested_amount ?? "-"}</td>
              <td>{a.status ?? "-"}</td>
              <td>
                {a.status === "pending" ? (
                  <>
                    <button onClick={() => decide(a.id, "approve")}>Approve</button>
                    <button onClick={() => decide(a.id, "reject")}>Reject</button>
                  </>
                ) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
