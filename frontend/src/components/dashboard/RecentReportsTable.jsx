import { useNavigate } from "react-router-dom";
import {
  CheckCircle,AlertCircle, AlertTriangle, ArrowRight,} from "lucide-react";

/* ── Recent reports ── */
const reports = [
  {
    id: "CR-2026-0248",
    patient: "Patient M., 45 ans",
    type: "Radiographie thoracique",
    urgent: false,
    date: "16 Mars 2026",
    time: "14:32",
    confidence: 95,
    confidenceColor: "#22c55e",
    status: "Validé",
    statusColor: "text-green-600 bg-green-50 border-green-200",
    statusIcon: CheckCircle,
  },
  {
    id: "CR-2026-0247",
    patient: "Patient F., 62 ans",
    type: "IRM cérébrale",
    urgent: true,
    date: "16 Mars 2026",
    time: "12:15",
    confidence: 88,
    confidenceColor: "#f59e0b",
    status: "À réviser",
    statusColor: "text-orange-600 bg-orange-50 border-orange-200",
    statusIcon: AlertCircle,
  },
  {
    id: "CR-2026-0246",
    patient: "Patient L., 38 ans",
    type: "Scanner abdominal",
    urgent: false,
    date: "16 Mars 2026",
    time: "10:48",
    confidence: 97,
    confidenceColor: "#22c55e",
    status: "Validé",
    statusColor: "text-green-600 bg-green-50 border-green-200",
    statusIcon: CheckCircle,
  },
  {
    id: "CR-2026-0245",
    patient: "Patient K., 29 ans",
    type: "Échographie cardiaque",
    urgent: false,
    date: "15 Mars 2026",
    time: "16:20",
    confidence: 92,
    confidenceColor: "#3b82f6",
    status: "En attente",
    statusColor: "text-yellow-600 bg-yellow-50 border-yellow-200",
    statusIcon: AlertTriangle,
  },
];

function RecentReportsTable() {
    const navigate = useNavigate();
  return (
        <div
          className="rounded-3xl bg-white p-8 shadow-sm"
          style={{ border: "1px solid #f1f5f9" }}
        >
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Rapports récents</h3>
              <p className="mt-1 text-sm text-gray-400">Dernières générations par l'IA</p>
            </div>
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-1 text-sm font-semibold text-[#06859F]/80 hover:text-[#06859F] transition"
            >
              Voir tout <ArrowRight size={15} />
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["ID / PATIENT", "TYPE D'EXAMEN", "DATE / HEURE", "CONFIANCE", "STATUT"].map(col => (
                  <th key={col} className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => {
                const StatusIcon = r.statusIcon;
                return (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 transition hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-4">
                      <p className="text-xs text-gray-400">{r.id}</p>
                      <p className="mt-0.5 text-sm font-bold text-gray-900">{r.patient}</p>
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
                            style={{ width: `${r.confidence}%`, backgroundColor: r.confidenceColor }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{r.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${r.statusColor}`}>
                        <StatusIcon size={12} />
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
    );      
}
export default RecentReportsTable;