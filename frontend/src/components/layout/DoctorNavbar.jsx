import {
  Brain,
  FileText,
  History,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import logo from "../../assets/logo.png";
import useResponsive from "../../hooks/useResponsive";

function DoctorNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { isMobile, isTablet, isDesktop } = useResponsive();

  const isCompact = isMobile || isTablet;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 ${
      isActive
        ? "bg-[linear-gradient(155deg,#e91e8c,#06b6d4)] text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-[linear-gradient(155deg,#e91e8c,#06b6d4)] text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 xl:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex h-12 w-12 items-center justify-center rounded-2xl md:h-14 md:w-14 xl:h-16 xl:w-16"
          >
            <img
              src={logo}
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </Link>

          <div>
            <h1 className="text-base font-bold leading-tight text-gray-900 md:text-lg">
              MedAI Radiology
            </h1>

            {isDesktop && (
              <p className="text-xs text-gray-400">
                Génération de rapports médicale avec l&apos;IA
              </p>
            )}
          </div>
        </div>

        {/* Desktop navigation */}
        {isDesktop && (
          <div className="flex items-center gap-1">
            <NavLink to="/dashboard" className={linkClass}>
              <Brain size={17} />
              Tableau de bord
            </NavLink>

            <NavLink to="/new-report" className={linkClass}>
              <FileText size={17} />
              Nouveau rapport
            </NavLink>

            <NavLink to="/history" className={linkClass}>
              <History size={17} />
              Historique
            </NavLink>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Desktop profile */}
          {isDesktop && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(155deg,#e91e8c,#06b6d4)",
                  }}
                >
                  <User size={14} color="white" />
                </div>

                Dr. Martin

                <ChevronDown
                  size={15}
                  className={`transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-100 bg-white py-2 shadow-lg">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User size={16} className="text-gray-400" />
                    Mon profil
                  </button>

                  <button
                    onClick={() => {
                      navigate("/settings");
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={16} className="text-gray-400" />
                    Paramètres
                  </button>

                  <hr className="my-1 border-gray-100" />

                  <button
                    onClick={() => {
                      navigate("/login");
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile / Tablet menu button */}
          {isCompact && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile / Tablet menu */}
      {isCompact && mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-sm">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/dashboard"
              className={mobileLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Brain size={18} />
              Tableau de bord
            </NavLink>

            <NavLink
              to="/new-report"
              className={mobileLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText size={18} />
              Nouveau rapport
            </NavLink>

            <NavLink
              to="/history"
              className={mobileLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <History size={18} />
              Historique
            </NavLink>

            <hr className="my-2 border-gray-100" />

            <button
              onClick={() => {
                navigate("/profile");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              <User size={18} />
              Mon profil
            </button>

            <button
              onClick={() => {
                navigate("/settings");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              <Settings size={18} />
              Paramètres
            </button>

            <button
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default DoctorNavbar;