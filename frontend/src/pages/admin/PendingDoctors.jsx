import { useEffect, useState } from "react";
import api from "../../services/api";

import AdminNavbar from "../../components/layout/AdminNavbar";
import AdminFooter from "../../components/layout/AdminFooter";

function PendingDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/doctors/pending");

      setDoctors(data);
    } catch (error) {
      console.error("Erreur chargement médecins :", error);
    } finally {
      setLoading(false);
    }
  };

  const validateDoctor = async (doctorId) => {
    try {
      await api.patch(`/doctors/${doctorId}`, {
        is_validated: true,
      });
      await fetchDoctors(); // Refresh la liste après validation
      window.dispatchEvent(new Event("pending-doctors-updated")); // Optionnel : pour notifier d'autres composants si besoin
    } catch (error) {
      console.error("Erreur validation médecin :", error);
    }
  };

  useEffect(() => {
    fetchDoctors();

    const interval = setInterval(() => {
    fetchDoctors();
  }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="mb-10 rounded-3xl bg-gradient-to-r from-pink-500 via-violet-600 to-cyan-500 px-10 py-12 text-white shadow-xl">
          <h1 className="text-3xl font-extrabold">
            Médecins en attente
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
            Validez les comptes médecins avant leur accès à la plateforme.
          </p>
        </section>

        {!loading && doctors.length === 0 && (
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Aucun médecin en attente.
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-lg"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {doctor.first_name} {doctor.last_name}
                  </h2>

                  <div className="mt-4 grid gap-2 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-800">
                        Email :
                      </span>{" "}
                      {doctor.email}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-800">
                        Spécialité :
                      </span>{" "}
                      {doctor.speciality}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-800">
                        RPPS :
                      </span>{" "}
                      {doctor.rpps_number}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-800">
                        Établissement :
                      </span>{" "}
                      {doctor.hospital}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => validateDoctor(doctor.id)}
                  className="rounded-xl bg-gradient-to-r from-pink-500 via-violet-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
                >
                  Valider le médecin
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AdminFooter />
    </div>
  );
}

export default PendingDoctors;