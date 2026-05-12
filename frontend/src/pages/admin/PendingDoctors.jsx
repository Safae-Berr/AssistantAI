import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/layout/AdminNavbar";
import AdminFooter from "../../components/layout/AdminFooter";

function PendingDoctors() {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("/api/admin/doctors/pending");
      setDoctors(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const validateDoctor = async (userId) => {
    try {
      await axios.post(`/api/admin/doctors/${userId}/validate`);
      fetchDoctors();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await axios.get("/api/admin/doctors/pending");
        console.log(res.data);
        setDoctors(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <section className="mb-10 rounded-3xl bg-gradient-to-r from-pink-500 via-violet-600 to-cyan-500 px-10 py-12 text-white shadow-xl">
          <h1 className="text-3xl font-extrabold">
            Médecins en attente
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
            Validez les comptes médecins avant leur accès à la plateforme.
          </p>
        </section>

        {/* Empty state */}
        {doctors.length === 0 && (
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Aucun médecin en attente.
            </p>
          </div>
        )}

        {/* Doctors list */}
        <div className="grid gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-lg"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Infos */}
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

                {/* Action */}
                <div>
                  <button
                    onClick={() => validateDoctor(doctor.user_id)}
                    className="rounded-xl bg-gradient-to-r from-pink-500 via-violet-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
                  >
                    Valider le médecin
                  </button>
                </div>
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