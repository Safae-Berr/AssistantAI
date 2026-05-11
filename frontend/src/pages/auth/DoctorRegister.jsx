// src/pages/auth/DoctorRegister.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Brain, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

import { registerDoctor } from '../../store/authSlice';

const INITIAL = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  rpps_number: '',
  speciality: '',
  hospital: '',
};

function DoctorRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await dispatch(registerDoctor(form));
    setSubmitting(false);
    if (registerDoctor.fulfilled.match(result)) {
      setSuccess(result.payload);
    } else {
      setError(result.payload || 'Inscription échouée');
    }
  }

  // After successful registration → success screen
  if (success) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4 py-10"
        style={{
          background:
            'linear-gradient(135deg,#e91e8c 0%,#7c3aed 40%,#06b6d4 80%)',
        }}
      >
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
            <CheckCircle size={28} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Compte créé</h2>
          <p className="mt-2 text-sm text-gray-600">
            Votre compte médecin a été créé avec succès. Pour finaliser
            l'activation :
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700">
            <li>Connectez-vous une première fois pour configurer la 2FA.</li>
            <li>
              Scannez le QR code avec Google Authenticator ou une application
              équivalente.
            </li>
            <li>
              Patientez ensuite la validation d'un administrateur avant de
              pouvoir utiliser pleinement la plateforme.
            </li>
          </ol>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 w-full rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
            style={{ background: 'linear-gradient(155deg,#e91e8c,#06b6d4)' }}
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background:
          'linear-gradient(135deg,#e91e8c 0%,#7c3aed 40%,#06b6d4 80%)',
      }}
    >
      <div className="w-full max-w-2xl">
        <Link
          to="/login"
          className="mb-4 inline-flex items-center gap-2 text-sm text-white/90 hover:text-white"
        >
          <ArrowLeft size={16} /> Retour à la connexion
        </Link>

        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: 'linear-gradient(155deg,#e91e8c,#06b6d4)' }}
            >
              <Brain size={24} color="white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Inscription médecin
              </h2>
              <p className="text-sm text-gray-500">
                Votre compte sera activé après validation d'un administrateur.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Prénom" value={form.first_name} onChange={update('first_name')} required />
              <Field label="Nom" value={form.last_name} onChange={update('last_name')} required />
              <Field label="Adresse e-mail" type="email" autoComplete="email" value={form.email} onChange={update('email')} required wide />
              <Field label="Mot de passe (8 caractères min.)" type="password" autoComplete="new-password" value={form.password} onChange={update('password')} required minLength={8} wide />
              <Field label="Numéro RPPS" value={form.rpps_number} onChange={update('rpps_number')} required pattern="\d{8,11}" placeholder="Ex. 10101234567" />
              <Field label="Spécialité" value={form.speciality} onChange={update('speciality')} placeholder="Ex. Neuroradiologie" />
              <Field label="Établissement" value={form.hospital} onChange={update('hospital')} placeholder="Ex. Raymond-Poincaré" wide />
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-60"
              style={{ background: 'linear-gradient(155deg,#e91e8c,#06b6d4)' }}
            >
              {submitting ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, wide, ...inputProps }) {
  return (
    <label className={`block ${wide ? 'md:col-span-2' : ''}`}>
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      <input
        {...inputProps}
        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#06b6d4]"
      />
    </label>
  );
}

export default DoctorRegister;
