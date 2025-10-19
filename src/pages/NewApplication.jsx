import React, { useEffect, useState } from "react";
import api from "../api";
import "./NewApplication.css";

export default function NewApplication() {
  const [investors, setInvestors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [incentives, setIncentives] = useState([]);
  const [form, setForm] = useState({
    investor_id: "",
    project_id: "",
    incentive_id: "",
    requested_amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, projRes, incRes] = await Promise.all([
          api.get("/investors"),
          api.get("/projects"),
          api.get("/incentives"),
        ]);
        setInvestors(invRes.data.data ?? invRes.data);
        setProjects(projRes.data.data ?? projRes.data);
        setIncentives(incRes.data.data ?? incRes.data);
      } catch (err) {
        console.error("Failed to load form data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/applications", form);
      setSubmitted(true);
      setForm({
        investor_id: "",
        project_id: "",
        incentive_id: "",
        requested_amount: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted)
    return (
      <div className="submitted-container">
        <div className="success-card">
          <div className="checkmark">✅</div>
          <h2>Application Submitted</h2>
          <p>
            Your application has been successfully recorded and is now pending
            review.
          </p>
          <button onClick={() => setSubmitted(false)}>Submit Another</button>
        </div>
      </div>
    );

  return (
    <div className="page new-application">
      <h2>New Application</h2>
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label>Investor</label>
          <select
            name="investor_id"
            value={form.investor_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Investor</option>
            {investors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Project</label>
          <select
            name="project_id"
            value={form.project_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Incentive</label>
          <select
            name="incentive_id"
            value={form.incentive_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Incentive</option>
            {incentives.map((i) => (
              <option key={i.id} value={i.id}>
                {i.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Requested Amount (₱)</label>
          <input
            type="number"
            name="requested_amount"
            value={form.requested_amount}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
