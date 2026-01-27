"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegulaminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f8f6f3]/95 backdrop-blur-sm border-b border-[#d4cec4]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-serif font-light text-[#4a4540] tracking-widest">
                ROYAL LIPS
              </h1>
            </Link>
            <Link
              href="/"
              className="flex items-center space-x-2 text-[#4a4540] hover:text-[#8b7355] transition-colors font-light text-sm tracking-wider uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Powrót</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-40 pb-12 px-4 border-b border-[#4a4540]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#4a4540] mb-4 tracking-wider">
            REGULAMIN
          </h1>
          <p className="text-sm text-[#8b8580] font-light">
            Ostatnia aktualizacja: Styczeń 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm p-8 md:p-12 space-y-8 rounded-2xl shadow-sm border border-[#d4cec4]">
            <div>
              <h2 className="text-xl font-serif font-light text-[#4a4540] mb-4 tracking-wider uppercase">
                1. Postanowienia ogólne
              </h2>
              <p className="text-[#4a4540]/80 font-light leading-relaxed">
                Niniejszy regulamin określa zasady korzystania z usług
                świadczonych przez Royal Lips - Joanna Wielgos, z siedzibą przy
                ul. Pużaka 37, 38-400 Krosno. Korzystanie z usług oznacza
                akceptację niniejszego regulaminu.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-[#4a4540] mb-4 tracking-wider uppercase">
                2. Rezerwacja wizyt
              </h2>
              <ul className="list-disc list-inside text-[#4a4540]/80 font-light space-y-2 ml-4">
                <li>
                  Rezerwacji wizyty można dokonać przez formularz online,
                  telefonicznie lub przez media społecznościowe.
                </li>
                <li>
                  Po dokonaniu rezerwacji skontaktujemy się w celu potwierdzenia
                  terminu w ciągu 24 godzin.
                </li>
                <li>
                  Rezerwacja jest wiążąca po otrzymaniu potwierdzenia od studia.
                </li>
                <li>
                  Przed zabiegiem wymagane jest wypełnienie formularza wywiadu
                  zdrowotnego.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-[#4a4540] mb-4 tracking-wider uppercase">
                3. Odwoływanie i zmiana terminu
              </h2>
              <ul className="list-disc list-inside text-[#4a4540]/80 font-light space-y-2 ml-4">
                <li>
                  Odwołanie lub zmiana terminu wizyty powinna nastąpić minimum
                  24 godziny przed umówionym terminem.
                </li>
                <li>
                  W przypadku niestawienia się na wizytę bez wcześniejszego
                  powiadomienia, studio zastrzega sobie prawo do pobrania opłaty
                  za rezerwację przy kolejnej wizycie.
                </li>
                <li>
                  W przypadku spóźnienia powyżej 15 minut, wizyta może zostać
                  skrócona lub przełożona na inny termin.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-[#4a4540] mb-4 tracking-wider uppercase">
                4. Przeciwwskazania do zabiegu
              </h2>
              <p className="text-[#4a4540]/80 font-light leading-relaxed mb-4">
                Zabiegi makijażu permanentnego nie mogą być wykonane w
                przypadku:
              </p>
              <ul className="list-disc list-inside text-[#4a4540]/80 font-light space-y-2 ml-4">
                <li>Ciąży i karmienia piersią</li>
                <li>Cukrzycy (wymagana konsultacja z lekarzem)</li>
                <li>Chorób autoimmunologicznych</li>
                <li>Aktywnej opryszczki w miejscu zabiegu</li>
                <li>Przyjmowania leków rozrzedzających krew</li>
                <li>Chorób skóry w miejscu zabiegu</li>
                <li>Skłonności do bliznowców</li>
                <li>Chemioterapii lub radioterapii</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-[#4a4540] mb-4 tracking-wider uppercase">
                5. Przygotowanie do zabiegu
              </h2>
              <ul className="list-disc list-inside text-[#4a4540]/80 font-light space-y-2 ml-4">
                <li>
                  Przed zabiegiem nie należy spożywać alkoholu (min. 24h przed)
                </li>
                <li>Nie należy opalać się (min. 2 tygodnie przed)</li>
                <li>
                  Nie stosować retinolu i kwasów w miejscu zabiegu (min. 2
                  tygodnie przed)
                </li>
                <li>Poinformować o wszystkich przyjmowanych lekach</li>
                <li>Przyjść na zabieg bez makijażu w okolicy zabiegu</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-[#4a4540] mb-4 tracking-wider uppercase">
                6. Gwarancja i korekta
              </h2>
              <p className="text-[#4a4540]/80 font-light leading-relaxed">
                Korekta jest wliczona w cenę zabiegu i powinna być wykonana w
                terminie 4-8 tygodni od pierwszego zabiegu. Brak stawienia się
                na korektę w wyznaczonym terminie skutkuje utratą gwarancji.
                Efekt końcowy zależy od indywidualnych predyspozycji skóry i
                przestrzegania zaleceń pozabiegowych.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-[#4a4540] mb-4 tracking-wider uppercase">
                7. Płatności
              </h2>
              <ul className="list-disc list-inside text-[#4a4540]/80 font-light space-y-2 ml-4">
                <li>Płatność następuje po wykonaniu zabiegu</li>
                <li>Akceptujemy płatność gotówką oraz kartą</li>
                <li>
                  Ceny usług dostępne są w cenniku na stronie lub w studio
                </li>
                <li>
                  Studio zastrzega sobie prawo do zmiany cen bez wcześniejszego
                  powiadomienia
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-[#4a4540] mb-4 tracking-wider uppercase">
                8. Reklamacje
              </h2>
              <p className="text-[#4a4540]/80 font-light leading-relaxed">
                Reklamacje należy zgłaszać pisemnie na adres email:
                kontakt@royallips.pl w terminie 14 dni od wykonania zabiegu.
                Reklamacja powinna zawierać opis problemu oraz dokumentację
                fotograficzną. Reklamacje rozpatrywane są w terminie 14 dni
                roboczych.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-light text-[#4a4540] mb-4 tracking-wider uppercase">
                9. Postanowienia końcowe
              </h2>
              <p className="text-[#4a4540]/80 font-light leading-relaxed">
                Studio zastrzega sobie prawo do zmiany regulaminu. О wszelkich
                zmianach klienci będą informowani na stronie internetowej. W
                sprawach nieuregulowanych niniejszym regulaminem zastosowanie
                mają przepisy Kodeksu Cywilnego.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4a4540] text-[#f8f6f3] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <span className="text-xl font-serif font-light tracking-widest">
                ROYAL LIPS
              </span>
              <p className="text-xs text-[#f8f6f3]/70 mt-3 font-light tracking-wider">
                Profesjonalny makijaż permanentny
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-[#f8f6f3]/70 font-light tracking-wider">
                © 2026 Royal Lips. Wszystkie prawa zastrzeżone.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
