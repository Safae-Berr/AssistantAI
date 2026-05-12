import AdminNavbar from "../../components/layout/AdminNavbar";
import AdminFooter from "../../components/layout/AdminFooter";
import { Link } from "react-router-dom";

function AdminDashboard() {
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

          <Link
            to="/admin/doctors/pending"
            className="inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-cyan-700 shadow"
          >
            Voir les médecins en attente →
          </Link>
        </section>
      </main>
      <AdminFooter />
    </div>
  );
}

export default AdminDashboard;