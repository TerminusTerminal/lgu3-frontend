import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Investors from "./pages/Investors";
import Incentives from "./pages/Incentives";
import Applications from "./pages/Applications";
import NewApplication from "./pages/NewApplication";
import Reports from "./pages/Reports";
import Projects from "./pages/Project"; // ✅ import the new Projects page
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/projects" element={<Projects />} /> {/* ✅ New Route */}
          <Route path="/incentives" element={<Incentives />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/new" element={<NewApplication />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>

      <Route path="*" element={<h2 style={{ padding: 20 }}>Page not found</h2>} />
    </Routes>
  );
}
