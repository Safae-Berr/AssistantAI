import {
  FileText, Clock, Activity, CheckCircle,
  AlertCircle, AlertTriangle, ArrowRight, TrendingUp, TrendingDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../../components/layout/HeroSection";

/* ── Stats cards ── */
const stats = [
  {
    label: "Rapports générés",
    value: "1,248",
    trend: "+18% ce mois",
    positive: true,
    icon: FileText,
    iconBg: "linear-gradient(135deg,#e91e8c,#de77b0)",
    borderColor: "#e91e8c",
  },
  {
    label: "Temps moyen",
    value: "45s",
    trend: "-22% ce mois",
    positive: false,
    icon: Clock,
    iconBg: "linear-gradient(135deg,#7c3aed,#8b5cf6)",
    borderColor: "#7c3aed",
  },
  {
    label: "Précision IA",
    value: "96.8%",
    trend: "+2.4% ce mois",
    positive: true,
    icon: Activity,
    iconBg: "linear-gradient(135deg,#06b6d4,#43bfd5)",
    borderColor: "#06b6d4",
  },
];

/* ── Recent reports ── */
const reports = [
  {
    id: "CR-2026-0248",
    patient: "Patient M., 45 ans",
    type: "Radiographie thoracique",
    urgent: false,
    model: "R2Gen IU X-Ray",
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
    model: "R2Gen MIMIC-CXR",
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
    model: "R2Gen IU X-Ray",
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
    model: "R2Gen MIMIC-CXR",
    date: "15 Mars 2026",
    time: "16:20",
    confidence: 92,
    confidenceColor: "#3b82f6",
    status: "En attente",
    statusColor: "text-yellow-600 bg-yellow-50 border-yellow-200",
    statusIcon: AlertTriangle,
  },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <main className="mx-auto max-w-7xl px-8 py-10">
        <HeroSection />  
        {/* ── Stats cards ── */}
        <div className="mb-10 grid grid-cols-3 gap-5">
          {stats.map(({ label, value, trend, positive, icon: Icon, iconBg, borderColor }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm"
              style={{ border: "1px solid #f1f5f9" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                  <div className="mt-3 flex items-center gap-1">
                    {positive
                      ? <TrendingUp size={14} className="text-green-500" />
                      : <TrendingDown size={14} className="text-red-500" />}
                    <span className={`text-xs font-semibold ${positive ? "text-green-500" : "text-red-500"}`}>
                      {trend}
                    </span>
                  </div>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: iconBg }}
                >
                  <Icon size={22} color="white" />
                </div>
              </div>
              {/* colored bottom border */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
                style={{ backgroundColor: borderColor }}
              />
            </div>
          ))}
        </div>

        {/* ── Recent reports table ── */}
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
              onClick={() => navigate("/historic")}
              className="flex items-center gap-1 text-sm font-semibold text-[#06859F]/80 hover:text-[#06859F] transition"
            >
              Voir tout <ArrowRight size={15} />
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["ID / PATIENT", "TYPE D'EXAMEN", "MODÈLE IA", "DATE / HEURE", "CONFIANCE", "STATUT"].map(col => (
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
                    <td className="py-4 text-sm text-gray-600">{r.model}</td>
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

      </main>
    </div>
  );
}

export default Dashboard;