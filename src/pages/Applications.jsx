import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Applications.css";

export default function Applications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await api.get("/applications");
      // Filter out archived ones by default
      const data = Array.isArray(r.data.data ?? r.data)
        ? r.data.data ?? r.data
        : [];
      setList(data.filter((a) => !a.archived)); // exclude archived apps
    } catch (err) {
      console.error("Failed to load applications", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const decide = async (id, action) => {
    try {
      await api.post(`/applications/${id}/decide`, {
        action,
        remarks: action === "approve" ? "Approved" : "Rejected",
      });
      fetchData();
    } catch (err) {
      console.error("Failed to decide", err);
    }
  };

  const archiveApplication = async (id) => {
    if (!window.confirm("Are you sure you want to archive this application?")) return;
    try {
      await api.post(`/applications/${id}/archive`);
      fetchData();
    } catch (err) {
      console.error("Failed to archive application", err);
    }
  };

  const restoreApplication = async (id) => {
    try {
      await api.post(`/applications/${id}/restore`);
      setSelectedApp(null);
      fetchData();
    } catch (err) {
      console.error("Failed to restore application", err);
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case "approved":
        return "status approved";
      case "rejected":
        return "status rejected";
      default:
        return "status pending";
    }
  };

  if (loading)
    return (
      <div className="page">
        <div className="loading-spinner"></div>
        <p>Loading applications...</p>
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <h2>Applications</h2>
        <button className="new-app-btn" onClick={() => navigate("/applications/new")}>
          + New Application
        </button>
      </div>

      {!list.length ? (
        <p>No active applications found.</p>
      ) : (
        <div className="app-grid">
          {list.map((a) => (
            <div className="app-card" key={a.id}>
              <div className="app-header">
                <h3>{a.project?.name ?? "Untitled Project"}</h3>
                <span className={statusClass(a.status)}>{a.status}</span>
              </div>

              <p>
                <strong>Investor:</strong> {a.investor?.name ?? "-"}
              </p>
              <p>
                <strong>Incentive:</strong> {a.incentive?.title ?? "-"}
              </p>
              <p>
                <strong>Requested:</strong> ₱{a.requested_amount ?? "-"}
              </p>

              <div className="app-actions">
                {a.status === "pending" ? (
                  <>
                    <button className="approve" onClick={() => decide(a.id, "approve")}>
                      Approve
                    </button>
                    <button className="reject" onClick={() => decide(a.id, "reject")}>
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button className="details" onClick={() => setSelectedApp(a)}>
                      View Details
                    </button>
                    <button className="archive" onClick={() => archiveApplication(a.id)}>
                      Archive
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Application Details</h3>
            <p><strong>ID:</strong> {selectedApp.id}</p>
            <p><strong>Investor:</strong> {selectedApp.investor?.name}</p>
            <p><strong>Project:</strong> {selectedApp.project?.name}</p>
            <p><strong>Incentive:</strong> {selectedApp.incentive?.title}</p>
            <p><strong>Requested Amount:</strong> ₱{selectedApp.requested_amount}</p>
            <p><strong>Status:</strong> {selectedApp.status}</p>
            <p><strong>Remarks:</strong> {selectedApp.remarks ?? "N/A"}</p>

            {selectedApp.archived ? (
              <button className="restore-btn" onClick={() => restoreApplication(selectedApp.id)}>
                Restore Application
              </button>
            ) : (
              <button className="archive" onClick={() => archiveApplication(selectedApp.id)}>
                Archive
              </button>
            )}

            <button className="close-btn" onClick={() => setSelectedApp(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
