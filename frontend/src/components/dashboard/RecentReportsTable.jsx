// src/components/dashboard/RecentReportsTable.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

import api from '../../services/api';

function getStatusConfig(status) {
  if (status === 'Validé') {
    return {
      icon: CheckCircle,
      className: 'text-green-600 bg-green-50 border-green-200',
    };
  }
  if (status === 'À réviser') {
    return {
      icon: AlertCircle,
      className: 'text-orange-600 bg-orange-50 border-orange-200',
    };
  }
  return {
    icon: AlertTriangle,
    className: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  };
}

function getConfidenceColor(confidence) {
  if (confidence >= 95) return '#22c55e';
  if (confidence >= 90) return '#3b82f6';
  if (confidence >= 80) return '#f59e0b';
  return '#ef4444';
}

function RecentReportsTable() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/dashboard/recent-reports')
      .then((res) => {
        if (!cancelled) setReports(res.data);
      })
      .catch((err) => console.error('Erreur chargement rapports:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="rounded-3xl bg-white p-8 shadow-sm"
      style={{ border: '1px solid #f1f5f9' }}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Rapports récents</h3>
          <p className="mt-1 text-sm text-gray-400">
            Dernières générations par l'IA
          </p>
        </div>

        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-1 text-sm font-semibold text-[#06859F]/80 transition hover:text-[#06859F]"
        >
          Voir tout <ArrowRight size={15} />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Chargement des rapports…</p>
      ) : reports.length === 0 ? (
        <p className="text-sm text-gray-400">Aucun rapport récent.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                'ID / PATIENT',
                "TYPE D'EXAMEN",
                'DATE / HEURE',
                'CONFIANCE',
                'STATUT',
              ].map((col) => (
                <th
                  key={col}
                  className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => {
              const statusConfig = getStatusConfig(r.status);
              const StatusIcon = statusConfig.icon;

              return (
                <tr
                  key={r.id}
                  className="cursor-pointer border-b border-gray-50 transition hover:bg-gray-50"
                >
                  <td className="py-4">
                    <p className="text-xs text-gray-400">{r.id}</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">
                      {r.patient}
                    </p>
                  </td>

                  <td className="py-4">
                    <p className="text-sm text-gray-700">{r.type}</p>
                    {r.urgent && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                        <AlertCircle size={11} /> Urgent
                      </span>
                    )}
                  </td>

                  <td className="py-4">
                    <p className="text-sm text-gray-700">{r.date}</p>
                    <p className="text-xs text-gray-400">{r.time}</p>
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${r.confidence}%`,
                            backgroundColor: getConfidenceColor(r.confidence),
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {r.confidence}%
                      </span>
                    </div>
                  </td>

                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${statusConfig.className}`}
                    >
                      <StatusIcon size={12} />
                      {r.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RecentReportsTable;
