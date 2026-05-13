import AdminNavbar from "../../components/layout/AdminNavbar";
import AdminFooter from "../../components/layout/AdminFooter";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="rounded-3xl bg-gradient-to-r from-pink-500 via-violet-600 to-cyan-500 px-10 py-14 text-white">
          <h2 className="mb-4 text-3xl font-extrabold">
            Bienvenue sur l’espace admin
          </h2>

          <p className="mb-8 max-w-2xl text-sm leading-6">
            Validez les comptes médecins et gérez l’accès à la plateforme.
          </p>

          <button
            onClick={() => navigate("/admin/doctors/pending")}
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-black shadow transition hover:shadow-xl hover:scale-105"
          >
              Voir les médecins en attente
              <ArrowRight className=" hover:translate-x-2" size={16} />
          </button>
        </section>
      </main>
      <AdminFooter />
    </div>
  );
}

export default AdminDashboard;