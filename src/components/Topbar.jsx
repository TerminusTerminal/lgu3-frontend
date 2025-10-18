import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";
import logoutVideo from "../assets/logout.mp4";

export default function Topbar() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    setShowConfirm(false);
    navigate("/login");
  };

  return (
    <>
      <header className="topbar">
        <div className="logo">LGU3 — Investment Promotion</div>
        <div className="user-actions">
          <button className="btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="btn logout" onClick={() => setShowConfirm(true)}>Logout</button>
        </div>
      </header>

      {showConfirm && (
        <div className="logout-popup">
          <div className="popup-content">
            <video className="logout-video" src={logoutVideo} autoPlay loop muted />
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="popup-buttons">
              <button className="btn confirm" onClick={handleLogout}>Yes</button>
              <button className="btn cancel" onClick={() => setShowConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
