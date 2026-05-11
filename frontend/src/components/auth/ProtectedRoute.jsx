// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  selectAuthStatus,
  selectIsAuthenticated,
  selectRole,
} from '../../store/authSlice';

/**
 * Usage:
 *   <ProtectedRoute roles={['doctor', 'admin']}>
 *     <Dashboard />
 *   </ProtectedRoute>
 */
function ProtectedRoute({ children, roles }) {
  const status = useSelector(selectAuthStatus);
  const isAuthed = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);
  const location = useLocation();

  // Still checking the cookie session — render nothing (avoid flash redirect)
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm text-gray-400">Chargement…</div>
      </div>
    );
  }

  if (!isAuthed) {
    // Send patients to patient access, everyone else to doctor login
    const target = location.pathname.startsWith('/patient') ? '/patient/access' : '/login';
    return <Navigate to={target} state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(role)) {
    // Logged in but wrong role — send each role to its own home
    if (role === 'patient') return <Navigate to="/patient" replace />;
    if (role === 'admin') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
