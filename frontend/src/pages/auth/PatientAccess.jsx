// src/pages/auth/PatientAccess.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { KeyRound, Calendar, AlertCircle } from 'lucide-react';
import logo from '../../assets/logo.png';

import {
  loginPatient,
  clearError,
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from '../../store/authSlice';

function PatientAccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthed = useSelector(selectIsAuthenticated);

  const [patientCode, setPatientCode] = useState('');
  const [birthDate, setBirthDate] = useState('');

  useEffect(() => {
    if (error) dispatch(clearError());
  }, [patientCode, birthDate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthed) {
      const target = location.state?.from?.pathname || '/patient';
      navigate(target, { replace: true });
    }
  }, [isAuthed, navigate, location.state]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      loginPatient({
        patientCode: patientCode.trim().toUpperCase(),
        birthDate,
      })
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background:
          'linear-gradient(135deg,#06b6d4 0%,#7c3aed 50%,#e91e8c 100%)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-6 flex items-center justify-center gap-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white backdrop-blur-sm">
            <img src={logo} alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">MedAI Radiology</h1>
            <p className="text-xs text-white/80">Espace professionnels de santé</p>
          </div>
        </div>
        

        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Accès patient
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Connectez-vous avec votre code patient et votre date de naissance
            pour consulter vos comptes rendus.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field
              icon={<KeyRound size={16} className="text-gray-400" />}
              label="Code patient"
              value={patientCode}
              onChange={(e) =>
                setPatientCode(e.target.value.toUpperCase())
              }
              placeholder="PAT-XXXXXX"
              required
            />
            <Field
              icon={<Calendar size={16} className="text-gray-400" />}
              label="Date de naissance"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-60"
              style={{
                background: 'linear-gradient(155deg,#06b6d4,#7c3aed)',
              }}
            >
              {status === 'loading' ? 'Connexion…' : 'Accéder à mes rapports'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, ...inputProps }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:border-[#06b6d4]">
        {icon}
        <input
          {...inputProps}
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>
    </label>
  );
}

export default PatientAccess;
