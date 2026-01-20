"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen bg-bg-main">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-main/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-serif font-light text-text-light tracking-widest">
                ROYAL LIPS
              </h1>
            </Link>
            <Link
              href="/"
              className="flex items-center space-x-2 text-text-light hover:text-accent-warm transition-colors font-light text-sm tracking-wider uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Powrót</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-40 pb-12 px-4 border-b border-text-light/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-text-light mb-4 tracking-wider">
            POLITYKA PRYWATNOŚCI
          </h1>
          <p className="text-sm text-text-light/60 font-light">
            Ostatnia aktualizacja: Styczeń 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-bg-light p-8 md:p-12 space-y-8">
            <div>
              <h2 className="text-xl font-serif font-light text-text-dark mb-4 tracking-wider uppercase">
                1. Administrator danych
              </h2>
              <p className="text-text-dark/70 font-light leading-relaxed">
                Administratorem Twoich danych osobowych jest Royal Lips - Joanna
                Wielgos, z siedzibą przy ul. Pużaka 37, 38-400 Krosno. Kontakt z
                administratorem możliwy jest pod adresem email:
                kontakt@royallips.pl lub telefonicznie: +48 792 377 737.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-text-dark mb-4 tracking-wider uppercase">
                2. Cele przetwarzania danych
              </h2>
              <p className="text-text-dark/70 font-light leading-relaxed mb-4">
                Twoje dane osobowe przetwarzamy w następujących celach:
              </p>
              <ul className="list-disc list-inside text-text-dark/70 font-light space-y-2 ml-4">
                <li>Realizacja rezerwacji i umówienie wizyty</li>
                <li>Kontakt w sprawie potwierdzenia terminu</li>
                <li>Przeprowadzenie wywiadu zdrowotnego przed zabiegiem</li>
                <li>Wysyłanie informacji marketingowych (za zgodą)</li>
                <li>Prowadzenie dokumentacji zabiegów</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-text-dark mb-4 tracking-wider uppercase">
                3. Podstawa prawna
              </h2>
              <p className="text-text-dark/70 font-light leading-relaxed">
                Przetwarzanie danych odbywa się na podstawie: Twojej zgody (art.
                6 ust. 1 lit. a RODO), wykonania umowy (art. 6 ust. 1 lit. b
                RODO), wypełnienia obowiązku prawnego (art. 6 ust. 1 lit. c
                RODO) oraz prawnie uzasadnionego interesu administratora (art. 6
                ust. 1 lit. f RODO).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-text-dark mb-4 tracking-wider uppercase">
                4. Okres przechowywania
              </h2>
              <p className="text-text-dark/70 font-light leading-relaxed">
                Dane osobowe przechowujemy przez okres niezbędny do realizacji
                celów, dla których zostały zebrane, a następnie przez okres
                wymagany przepisami prawa (dokumentacja medyczna - 20 lat,
                dokumentacja księgowa - 5 lat).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-text-dark mb-4 tracking-wider uppercase">
                5. Twoje prawa
              </h2>
              <p className="text-text-dark/70 font-light leading-relaxed mb-4">
                Przysługują Ci następujące prawa:
              </p>
              <ul className="list-disc list-inside text-text-dark/70 font-light space-y-2 ml-4">
                <li>Prawo dostępu do swoich danych</li>
                <li>Prawo do sprostowania danych</li>
                <li>
                  Prawo do usunięcia danych ("prawo do bycia zapomnianym")
                </li>
                <li>Prawo do ograniczenia przetwarzania</li>
                <li>Prawo do przenoszenia danych</li>
                <li>Prawo do wniesienia sprzeciwu</li>
                <li>Prawo do cofnięcia zgody w dowolnym momencie</li>
                <li>Prawo do wniesienia skargi do organu nadzorczego (UODO)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-text-dark mb-4 tracking-wider uppercase">
                6. Odbiorcy danych
              </h2>
              <p className="text-text-dark/70 font-light leading-relaxed">
                Twoje dane mogą być przekazywane podmiotom świadczącym usługi na
                rzecz administratora: hostingodawcy, dostawcy systemu
                rezerwacji, dostawcy usług email. Dane nie są przekazywane do
                państw trzecich.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-text-dark mb-4 tracking-wider uppercase">
                7. Pliki cookies
              </h2>
              <p className="text-text-dark/70 font-light leading-relaxed">
                Strona wykorzystuje pliki cookies w celu zapewnienia
                prawidłowego działania, analizy ruchu oraz personalizacji
                treści. Możesz zarządzać ustawieniami cookies w swojej
                przeglądarce.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-text-dark mb-4 tracking-wider uppercase">
                8. Kontakt
              </h2>
              <p className="text-text-dark/70 font-light leading-relaxed">
                W sprawach związanych z ochroną danych osobowych możesz
                skontaktować się z nami pod adresem: kontakt@royallips.pl lub
                telefonicznie: +48 792 377 737.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-taupe text-text-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <span className="text-xl font-serif font-light tracking-widest">
                ROYAL LIPS
              </span>
              <p className="text-xs text-text-light/70 mt-3 font-light tracking-wider">
                Profesjonalny makijaż permanentny
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-text-light/70 font-light tracking-wider">
                © 2025 Royal Lips. Wszystkie prawa zastrzeżone.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
