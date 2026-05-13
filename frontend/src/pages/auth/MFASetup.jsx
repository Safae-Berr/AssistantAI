// src/pages/auth/MFASetup.jsx
//
// Two phases:
//   Phase 1 — fetch /auth/mfa/setup, display the SVG QR + manual secret
//   Phase 2 — user enters the first TOTP code → /auth/mfa/confirm

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, CheckCircle, Copy } from 'lucide-react';

import api from "../../services/api";

function MFASetup() {
  const navigate = useNavigate();

  const [setupData, setSetupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totpCode, setTotpCode] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  // Phase 1 — call /auth/mfa/setup once on mount
  useEffect(() => {
    let cancelled = false;
    api
      .post('/auth/mfa/setup')
      .then((res) => {
        if (!cancelled) setSetupData(res.data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err?.response?.data?.detail || 'Erreur lors du setup MFA');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleConfirm(e) {
    e.preventDefault();
    setConfirming(true);
    setError(null);
    try {
      await api.post('/auth/mfa/confirm', { totp_code: totpCode });
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Code TOTP invalide');
    } finally {
      setConfirming(false);
    }
  }

  function copySecret() {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret).catch(() => {});
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
            <CheckCircle size={28} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">2FA activée</h2>
          <p className="mt-2 text-sm text-gray-600">
            Votre authentification à deux facteurs est désormais active. Vous
            devrez saisir un code à chaque connexion.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
            style={{ background: 'linear-gradient(155deg,#e91e8c,#06b6d4)' }}
          >
            Aller au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(155deg,#e91e8c,#06b6d4)' }}
          >
            <ShieldCheck size={24} color="white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Configurer la 2FA
            </h2>
            <p className="text-sm text-gray-500">
              Une couche de sécurité supplémentaire pour protéger vos données.
            </p>
          </div>
        </div>

        {loading && <p className="text-sm text-gray-500">Préparation…</p>}

        {error && !loading && (
          <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {setupData && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* QR side */}
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                1. Scannez le QR code
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Utilisez Google Authenticator, Microsoft Authenticator, Authy
                ou équivalent.
              </p>
              <div
                className="mt-3 flex items-center justify-center rounded-2xl border border-gray-100 bg-white p-3"
                // Inject the inline SVG returned by the backend
                dangerouslySetInnerHTML={{ __html: setupData.qr_code_svg }}
              />
              <div className="mt-3">
                <p className="text-xs text-gray-500">Ou saisissez ce code :</p>
                <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm">
                  <span className="flex-1 break-all">{setupData.secret}</span>
                  <button
                    type="button"
                    onClick={copySecret}
                    className="text-gray-400 hover:text-gray-700"
                    aria-label="Copier"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm side */}
            <form onSubmit={handleConfirm}>
              <h3 className="text-sm font-bold text-gray-900">
                2. Confirmez avec le premier code
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Saisissez le code à 6 chiffres affiché par votre application
                pour valider la configuration.
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                pattern="\d{6}"
                value={totpCode}
                onChange={(e) =>
                  setTotpCode(e.target.value.replace(/\D/g, ''))
                }
                placeholder="123456"
                className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 outline-none focus:border-[#06b6d4]"
              />

              <button
                type="submit"
                disabled={totpCode.length !== 6 || confirming}
                className="mt-4 w-full rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-60"
                style={{
                  background: 'linear-gradient(155deg,#e91e8c,#06b6d4)',
                }}
              >
                {confirming ? 'Vérification…' : 'Activer la 2FA'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default MFASetup;
