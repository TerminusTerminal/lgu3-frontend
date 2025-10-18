import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaUsers, FaGift, FaFileAlt, FaChartBar } from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userName = localStorage.getItem("user_name") || "User";

  return (
    <aside className="sidebar">
      <div className="profile-section">
        <div className="avatar">{userName[0].toUpperCase()}</div>
        <div className="username">{userName}</div>
      </div>

      <nav>
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "active" : ""}>
          <FaUser className="icon"/> Dashboard
        </NavLink>

        <button
          className={`dropdown-btn ${dropdownOpen ? "active" : ""}`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span><FaUsers className="icon"/> Investment Promotion & Incentive</span>
          <span className={`arrow ${dropdownOpen ? "open" : ""}`}>&#9660;</span>
        </button>

        <div className={`dropdown-links ${dropdownOpen ? "open" : ""}`}>
          <NavLink to="/investors" className={({isActive}) => isActive ? "active" : ""}><FaUsers/> Investors</NavLink>
          <NavLink to="/incentives" className={({isActive}) => isActive ? "active" : ""}><FaGift/> Incentives</NavLink>
          <NavLink to="/applications" className={({isActive}) => isActive ? "active" : ""}><FaFileAlt/> Applications</NavLink>
          <NavLink to="/reports" className={({isActive}) => isActive ? "active" : ""}><FaChartBar/> Reports</NavLink>
        </div>
      </nav>
    </aside>
  );
}
