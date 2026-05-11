// src/routes/DoctorRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from '../pages/doctor/Dashboard';
import History from '../pages/doctor/History';
import NewReport from '../pages/doctor/NewReport';

import DoctorNavbar from '../components/layout/DoctorNavbar';
import DoctorFooter from '../components/layout/DoctorFooter';

function DoctorRoutes() {
  return (
    <>
      <DoctorNavbar />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/new-report" element={<NewReport />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <DoctorFooter />
    </>
  );
}

export default DoctorRoutes;
