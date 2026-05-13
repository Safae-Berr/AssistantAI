import { Plus} from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
       return (
        <div
          className="relative mb-10 overflow-hidden rounded-3xl px-10 py-12"
          style={{ background: "linear-gradient(135deg,#e91e8c 0%,#7c3aed  40%,#06b6d4 80%), #f97316 100%" }}>
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-white leading-snug">
              Bienvenue sur MedAI Radiology
            </h2>
            <p className="mt-3 text-[#F7F7F7] text-sm leading-relaxed">
              Générez automatiquement des comptes-rendus d'imagerie médicale avec l'IA générative.
              Gain de temps, précision améliorée, meilleurs soins.
            </p>
            <button
              onClick={() => navigate("/new-report")}
              className="mt-6 flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold  shadow-lg transition hover:shadow-xl hover:scale-105"
            >
              <Plus size={16} />
              Créer un nouveau rapport
            </button>
          </div>
        </div>
       )
}
export default HeroSection;