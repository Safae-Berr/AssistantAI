// src/routes/AppRoutes.jsx
import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  bootstrapAuth,
  sessionExpired,
  selectAuthStatus,
  selectRole,
} from '../store/authSlice';

import ProtectedRoute from '../components/auth/ProtectedRoute';

import DoctorRoutes from './DoctorRoutes';
import PatientRoutes from './PatientRoutes';
import AdminRoutes from './AdminRoutes';

import DoctorLogin from '../pages/auth/DoctorLogin';
import DoctorRegister from '../pages/auth/DoctorRegister';
import MFASetup from '../pages/auth/MFASetup';
import PatientAccess from '../pages/auth/PatientAccess';

const PORTAL = import.meta.env.VITE_PORTAL || 'doctor';
const appType = import.meta.env.VITE_APP_TYPE;

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-sm text-gray-400">Initialisation…</div>
    </div>
  );
}

function AppRoutes() {
  const dispatch = useDispatch();
  const location = useLocation();

  const status = useSelector(selectAuthStatus);
  const role = useSelector(selectRole);

  const publicPaths = [
    '/login',
    '/register',
    '/admin/login',
    '/access',
    '/patient/access',
    '/mfa/setup',
  ];

  const isPublicPath = publicPaths.includes(location.pathname);

  useEffect(() => {
    if (!isPublicPath && status !== 'authenticated') {
      dispatch(bootstrapAuth());
    }
  }, [dispatch, isPublicPath, status]);

  useEffect(() => {
    const handler = () => dispatch(sessionExpired());

    window.addEventListener('auth:session-expired', handler);

    return () => {
      window.removeEventListener('auth:session-expired', handler);
    };
  }, [dispatch]);

  if (appType === 'admin') {
    return <AdminRoutes />;
  }

  if (!isPublicPath && (status === 'idle' || status === 'loading')) {
    return <LoadingScreen />;
  }

  if (PORTAL === 'patient') {
    return (
      <Routes>
        <Route path="/" element={<PatientAccess />} />
        <Route path="/access" element={<PatientAccess />} />
        <Route path="/patient/access" element={<PatientAccess />} />

        <Route
          path="/patient/*"
          element={
            <ProtectedRoute roles={['patient']}>
              <PatientRoutes />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={role === 'patient' ? '/login' : '/dashboard'}
            replace
          />
        }
      />

      <Route path="/login" element={<DoctorLogin />} />
      <Route path="/register" element={<DoctorRegister />} />

      <Route
        path="/mfa/setup"
        element={
          <ProtectedRoute roles={['doctor', 'admin']}>
            <MFASetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute roles={['doctor', 'admin']}>
            <DoctorRoutes />
          </ProtectedRoute>
        }
      />

      <Route path="/patient/*" element={<Navigate to="/login" replace />} />
      <Route path="/patient/access" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;