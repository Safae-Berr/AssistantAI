import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

import {
  loginDoctor,
  verifyMfa,
  clearError,
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
  selectUser,
} from '../../store/authSlice';

import logo from '../../assets/logo.png';

function DoctorLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthed = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');

  useEffect(() => {
    if (error) dispatch(clearError());
  }, [email, password, totpCode, error, dispatch]);

  useEffect(() => {
    if (error === "Account pending admin validation") {
      toast.error("Connexion impossible", {
        description:
          "Votre compte est en attente de validation par l’administration.",
        duration: 6000,
      });
    }
  }, [error]);

  useEffect(() => {
    if (!isAuthed) return;

    if (user?.mfa_enabled === false) {
      navigate('/mfa/setup', { replace: true });
      return;
    }

    const target = location.state?.from?.pathname || '/dashboard';
    navigate(target, { replace: true });
  }, [isAuthed, user, navigate, location.state]);

  const inMfaStep = status === 'mfa_required';
  const submitting = status === 'loading';

  function handlePasswordSubmit(e) {
    e.preventDefault();
    dispatch(loginDoctor({ email, password }));
  }

  function handleTotpSubmit(e) {
    e.preventDefault();
    dispatch(verifyMfa({ totpCode }));
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background:
          'linear-gradient(135deg,#e91e8c 0%,#7c3aed 40%,#06b6d4 80%)',
      }}
    >
      <div className="w-full max-w-md">
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
          {!inMfaStep ? (
            <PasswordStep
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              error={error}
              submitting={submitting}
              onSubmit={handlePasswordSubmit}
            />
          ) : (
            <TotpStep
              totpCode={totpCode}
              setTotpCode={setTotpCode}
              error={error}
              onSubmit={handleTotpSubmit}
            />
          )}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm text-white/90">
          <span>
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold underline hover:text-white">
              S'inscrire
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

function PasswordStep({ email, setEmail, password, setPassword, error, submitting, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
      <p className="mt-1 text-sm text-gray-500">
        Connectez-vous à votre compte médecin.
      </p>

      <div className="mt-6 space-y-4">
        <Field
          icon={<Mail size={16} className="text-gray-400" />}
          label="Adresse e-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="prenom.nom@aphp.fr"
          autoComplete="email"
          required
        />
        <Field
          icon={<Lock size={16} className="text-gray-400" />}
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {error && <ErrorBanner message={error} />}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-60"
        style={{ background: 'linear-gradient(155deg,#e91e8c,#06b6d4)' }}
      >
        {submitting ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}

function TotpStep({ totpCode, setTotpCode, error, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-2 flex items-center gap-2 text-[#06859F]">
        <ShieldCheck size={18} />
        <span className="text-xs font-bold uppercase tracking-wider">
          Authentification à deux facteurs
        </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Code de vérification</h2>

      <p className="mt-1 text-sm text-gray-500">
        Saisissez le code à 6 chiffres affiché par votre application
        d'authentification.
      </p>

      <div className="mt-6">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          pattern="\d{6}"
          autoFocus
          value={totpCode}
          onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
          placeholder="123456"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 outline-none transition focus:border-[#06b6d4]"
        />
      </div>

      {error && <ErrorBanner message={error} />}

      <button
        type="submit"
        disabled={totpCode.length !== 6}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-60"
        style={{ background: 'linear-gradient(155deg,#e91e8c,#06b6d4)' }}
      >
        Valider le code
      </button>
    </form>
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

function ErrorBanner({ message }) {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export default DoctorLogin;