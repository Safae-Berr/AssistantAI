import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';

function useAdminNotifications() {
  const user = useSelector(selectUser);
  const isAdmin = user?.role === 'admin';

  const [pendingCount, setPendingCount] = useState(0);

  const reloadPendingDoctors = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const res = await fetch('/api/admin/doctors/pending', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setPendingCount(Array.isArray(data) ? data.length : data.count ?? 0);
      }
    } catch (err) {
      console.error('Failed to load pending doctors', err);
    }
  }, [isAdmin]);

  useEffect(() => {
    reloadPendingDoctors();
  }, [reloadPendingDoctors]);

  const resetBadge = useCallback(() => {
    reloadPendingDoctors();
  }, [reloadPendingDoctors]);

  useEffect(() => {
  if (!isAdmin) return;

  const handler = () => {
    reloadPendingDoctors();
  };

  window.addEventListener("pending-doctors-updated", handler);

  return () => {
    window.removeEventListener("pending-doctors-updated", handler);
  };
}, [isAdmin, reloadPendingDoctors]);

  useEffect(() => {
    if (!isAdmin) return;

    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url = `${proto}//${window.location.host}/api/ws/admin`;

    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'doctor_registered') {
          const d = data.doctor;
          const name = `${d.first_name ?? ''} ${d.last_name ?? ''}`.trim();

          toast.success('Nouveau médecin à valider', {
            description: `${name} (${d.email}) attend votre validation.`,
            duration: 8000,
          });

          setPendingCount((c) => c + 1);
        }
      } catch (err) {
        console.error('Invalid WS message', err);
      }
    };

    ws.onerror = (err) => console.error('WS error', err);
    ws.onclose = () => console.log('WS closed');

    return () => ws.close();
  }, [isAdmin]);

  return { pendingCount, resetBadge, reloadPendingDoctors };
}

export default useAdminNotifications;