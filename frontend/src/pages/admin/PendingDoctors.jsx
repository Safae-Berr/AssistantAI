import { useEffect, useState } from "react";
import axios from "axios";

function PendingDoctors() {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    const res = await axios.get("/api/admin/doctors/pending");
    setDoctors(res.data);
  };

  const validateDoctor = async (userId) => {
    await axios.post(`/api/admin/doctors/${userId}/validate`);
    fetchDoctors();
  };
    useEffect(() => {   
    fetchDoctors();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Médecins en attente</h1>

      {doctors.length === 0 && <p>Aucun médecin en attente.</p>}

      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginBottom: 15,
            borderRadius: 10,
          }}
        >
          <h3>
            {doctor.first_name} {doctor.last_name}
          </h3>

          <p>Email : {doctor.user?.email}</p>
          <p>Spécialité : {doctor.speciality}</p>
          <p>RPPS : {doctor.rpps_number}</p>
          <p>Établissement : {doctor.hospital}</p>

          <button onClick={() => validateDoctor(doctor.user_id)}>
            Valider
          </button>
        </div>
      ))}
    </div>
  );
}

export default PendingDoctors;