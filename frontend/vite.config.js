import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// In dev, the frontend runs on :5173 and the backend on :8000.
// httpOnly cookies require same-origin OR HTTPS+SameSite=None+Secure.
// We use Vite's proxy so the browser sees everything as :5173 → cookies just work
// with SameSite=Lax and Secure=False (dev only).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Strip the /api prefix before forwarding to FastAPI
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
