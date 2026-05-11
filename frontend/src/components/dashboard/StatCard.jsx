// src/components/dashboard/StatCard.jsx
import { useEffect, useState } from 'react';
import {
  FileText,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

import api from '../../services/api';

const iconConfig = {
  reports: {
    icon: FileText,
    iconBg: 'linear-gradient(135deg,#e91e8c,#de77b0)',
    borderColor: '#e91e8c',
  },
  time: {
    icon: Clock,
    iconBg: 'linear-gradient(135deg,#7c3aed,#8b5cf6)',
    borderColor: '#7c3aed',
  },
  accuracy: {
    icon: Activity,
    iconBg: 'linear-gradient(135deg,#06b6d4,#43bfd5)',
    borderColor: '#06b6d4',
  },
};

function StatCard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/dashboard/stats')
      .then((res) => {
        if (!cancelled) setStats(res.data);
      })
      .catch((err) => console.error('Erreur chargement stats:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-gray-500">Chargement des statistiques…</p>;
  }

  return (
    <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
      {stats.map(({ label, value, trend, positive, type }) => {
        const config = iconConfig[type];
        const Icon = config?.icon || Activity;

        return (
          <div
            key={label}
            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm"
            style={{ border: '1px solid #f1f5f9' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>

                <div className="mt-3 flex items-center gap-1">
                  {positive ? (
                    <TrendingUp size={14} className="text-green-500" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      positive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {trend}
                  </span>
                </div>
              </div>

              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: config?.iconBg }}
              >
                <Icon size={22} color="white" />
              </div>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
              style={{ backgroundColor: config?.borderColor }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default StatCard;
