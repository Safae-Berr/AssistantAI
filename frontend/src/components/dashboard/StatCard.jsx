import { FileText, Clock, Activity, TrendingUp, TrendingDown } from "lucide-react";
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

function StatCard() {
  return (      
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
    )   
}
export default StatCard;