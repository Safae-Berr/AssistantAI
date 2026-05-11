import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/auth/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import PendingDoctors from "../pages/admin/PendingDoctors";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/doctors/pending" element={<PendingDoctors />} />
    </Routes>
  );
}

export default AdminRoutes;