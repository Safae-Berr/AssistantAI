import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function DoctorFooter() {
  return (
    <footer className="mt-16 w-full border-t border-gray-100 bg-white px-6 py-10 sm:px-10 lg:px-16 xl:mt-24">
      <div className="w-full">
        {/* 
          Mobile  : 1 colonne
          Tablette: 2 colonnes
          Desktop : 3 colonnes
        */}
        <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          
          {/* MedAI */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src={logo}
                alt="MedAI Logo"
                className="h-auto w-16"
              />

              <div>
                <h3 className="text-lg font-bold">MedAI</h3>

                <p className="text-xs tracking-widest text-gray-500">
                  RADIOLOGY
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-gray-600">
              MedAI Radiology est une solution intelligente de génération
              automatique de comptes rendus d&apos;imagerie médicale,
              conçue pour accompagner les professionnels de santé.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-lg font-bold uppercase">
              Company
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  to="/"
                  className="transition hover:text-[#06859F]"
                >
                  Accueil
                </Link>
              </li>

              <li>
                <Link
                  to="/history"
                  className="transition hover:text-[#06859F]"
                >
                  Comptes rendus
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="transition hover:text-[#06859F]"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-bold uppercase">
              Get in touch
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  to="mailto:safae.berrichi@epfedu.fr"
                  className="break-all transition hover:text-[#06859F]"
                >
                  safae.berrichi@epfedu.fr
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 w-full border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © 2026 MedAI Radiology. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

export default DoctorFooter;