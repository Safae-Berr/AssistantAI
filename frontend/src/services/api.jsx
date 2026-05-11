// src/services/api.js
//
// Centralized axios client.
// - baseURL: '/api' (Vite proxy forwards to localhost:8000)
// - withCredentials: true (cookies are sent on every request)
// - Response interceptor: on 401, try POST /auth/refresh once, then retry.
//   If refresh also fails, dispatch a logout event so the auth slice clears.

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// ------------------------------------------------------------------
// Refresh-on-401 logic
//
// We must guard against:
//   (a) infinite loops if /auth/refresh itself returns 401
//   (b) multiple concurrent 401s all triggering /auth/refresh
// ------------------------------------------------------------------

let refreshPromise = null;

function isRefreshableUrl(config) {
  // Don't auto-refresh on the auth endpoints themselves
  const url = config?.url || '';
  return (
    !url.startsWith('/auth/login') &&
    !url.startsWith('/auth/refresh') &&
    !url.startsWith('/auth/register') &&
    !url.startsWith('/auth/mfa/verify')
  );
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    if (status !== 401 || !original || original._retried || !isRefreshableUrl(original)) {
      return Promise.reject(error);
    }

    original._retried = true;

    try {
      // Coalesce concurrent refreshes into a single request
      if (!refreshPromise) {
        refreshPromise = api.post('/auth/refresh').finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      return api(original);
    } catch (refreshErr) {
      // Refresh failed -> let the app know it must redirect to /login
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
      return Promise.reject(refreshErr);
    }
  }
);

export default api;
