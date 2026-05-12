// src/services/api.js
//
// Centralized axios client.
// - baseURL: '/api' (Vite proxy forwards to backend)
// - withCredentials: true (cookies are always sent)
// - Automatically refresh access token on 401 once
// - Prevent infinite refresh loops
// - Notify app when session expires

import axios from 'axios';

const api = axios.create({
  baseURL:  '/api',
  withCredentials: true,
});

// ------------------------------------------------------------------
// Refresh-on-401 logic
// ------------------------------------------------------------------

let refreshPromise = null;

/**
 * Returns true only for requests that are allowed
 * to trigger automatic token refresh.
 */
function isRefreshableUrl(config) {
  const url = config?.url || '';

  return (
    !url.startsWith('/auth/login') &&
    !url.startsWith('/auth/me') &&
    !url.startsWith('/auth/refresh') &&
    !url.startsWith('/auth/register') &&
    !url.startsWith('/auth/mfa/verify')
  );
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // Ignore non-401 errors
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Missing request config
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Already retried once
    if (originalRequest._retried) {
      return Promise.reject(error);
    }

    // Auth endpoints should never trigger refresh
    if (!isRefreshableUrl(originalRequest)) {
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    try {
      // Prevent multiple refresh calls simultaneously
      if (!refreshPromise) {
        refreshPromise = api
          .post('/auth/refresh')
          .finally(() => {
            refreshPromise = null;
          });
      }

      // Wait for refresh to complete
      await refreshPromise;

      // Retry original request
      return api(originalRequest);

    } catch (refreshError) {
      // Session expired
      window.dispatchEvent(
        new CustomEvent('auth:session-expired')
      );

      return Promise.reject(refreshError);
    }
  }
);

export default api;