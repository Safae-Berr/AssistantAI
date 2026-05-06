import { Brain, FileText, History, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";

function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 ${
      isActive
        ? "bg-[linear-gradient(155deg,#e91e8c,#06b6d4)] text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

        {/* Logo + titre */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl">
                <Link to="/dashboard">
                    <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                </Link>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">MedAI Radiology</h1>
            <p className="text-xs text-gray-400">Génération de rapports médicale avec l'IA</p>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink to="/dashboard" className={linkClass}>
            <Brain size={17} />
            Tableau de bord
          </NavLink>
          <NavLink to="/new-report" className={linkClass}>
            <FileText size={17} />
            Nouveau rapport
          </NavLink>
          <NavLink to="/historic" className={linkClass}>
            <History size={17} />
            Historique
          </NavLink>
        </div>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: "linear-gradient(155deg,#e91e8c,#06b6d4)" }}
            >
              <User size={14} color="white" />
            </div>
            Dr. Martin
            <ChevronDown size={15} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-100 bg-white py-2 shadow-lg">
              <button
                onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User size={16} className="text-gray-400" />
                Mon profil
              </button>
              <button
                onClick={() => { navigate("/settings"); setDropdownOpen(false); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Settings size={16} className="text-gray-400" />
                Paramètres
              </button>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={() => { navigate("/login"); setDropdownOpen(false); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;