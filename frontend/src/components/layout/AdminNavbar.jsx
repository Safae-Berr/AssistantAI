import {
  Brain,
  UserCheck,
  Users,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import logo from "../../assets/logo.png";
import { logout, selectUser } from "../../store/authSlice";

function AdminNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await dispatch(logout());
    navigate("/admin/login", { replace: true });
  }

  const displayName = user?.email ? user.email.split("@")[0] : "Admin";
  const initials = user?.email?.[0]?.toUpperCase() || "A";

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 ${
      isActive
        ? "bg-[linear-gradient(155deg,#e91e8c,#06b6d4)] text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 xl:px-8">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="flex h-12 w-12 items-center justify-center rounded-2xl md:h-14 md:w-14 xl:h-16 xl:w-16"
          >
            <img src={logo} alt="Logo" className="h-full w-full object-contain" />
          </Link>

          <div>
            <h1 className="text-base font-bold leading-tight text-gray-900 md:text-lg">
              MedAI Radiology
            </h1>
            <p className="text-xs text-gray-400">
              Administration de la plateforme
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <NavLink to="/admin/dashboard" className={linkClass}>
            <Brain size={17} /> Tableau de bord
          </NavLink>

          <NavLink to="/admin/doctors/pending" className={linkClass}>
            <UserCheck size={17} /> Médecins en attente
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <Users size={17} /> Utilisateurs
          </NavLink>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "linear-gradient(155deg,#e91e8c,#06b6d4)" }}
            >
              {initials}
            </div>

            {displayName}

            <ChevronDown
              size={15}
              className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white py-2 shadow-lg">
              <div className="border-b border-gray-100 px-4 pb-2 pt-1">
                <p className="text-xs text-gray-400">Connecté en tant que</p>
                <p className="text-sm font-semibold text-gray-700">
                  {user?.email || "admin"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut size={16} /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default AdminNavbar;