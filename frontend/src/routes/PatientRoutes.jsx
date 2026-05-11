// src/routes/PatientRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from 'lucide-react';

import { logout, selectUser } from '../store/authSlice';

// Minimal placeholder page — replace with real patient pages later
function PatientHome() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        Bonjour {user?.first_name} {user?.last_name}
      </h1>
      <p className="mt-2 text-gray-500">Vos comptes rendus s'afficheront ici.</p>
      <button
        onClick={() => dispatch(logout())}
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        <LogOut size={16} /> Déconnexion
      </button>
    </div>
  );
}

function PatientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PatientHome />} />
      <Route path="*" element={<Navigate to="/patient" replace />} />
    </Routes>
  );
}

export default PatientRoutes;
