"use client";

import { useState } from "react";
import { Instagram, Phone, Mail, ChevronDown, ChevronUp, Check } from "lucide-react";
import SignaturePad from "../components/SignaturePad";
import {
  ConsentFormData,
  defaultContraindications,
  contraindicationLabels,
} from "../types/booking";

const initialFormData: ConsentFormData = {
  imieNazwisko: "",
  adres: "",
  dataUrodzenia: "",
  telefon: "",
  miejscowoscData: "",
  nazwaProduktu: "",
  obszarZabiegu: "",
  celEfektu: "",
  przeciwwskazania: { ...defaultContraindications },
  zgodaPrzetwarzanieDanych: false,
  zgodaMarketing: false,
  zgodaFotografie: false,
  miejscaPublikacjiFotografii: "",
  podpisDane: "",
  podpisMarketing: "",
  podpisFotografie: "",
  podpisRodo: "",
};

export default function ConsentFormPage() {
  const [formData, setFormData] = useState<ConsentFormData>(initialFormData);
  const [expandedSections, setExpandedSections] = useState({
    reakcje: false,
    powiklania: false,
    zalecenia: false,
    rodo: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: keyof ConsentFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData((prev) => ({ ...prev, telefon: formatted }));
  };

  const formatBirthDate = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
  };

  const handleBirthDateChange = (value: string) => {
    const formatted = formatBirthDate(value);
    setFormData((prev) => ({ ...prev, dataUrodzenia: formatted }));
  };

  const handleContraindicationChange = (
    field: keyof ConsentFormData["przeciwwskazania"],
    value: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      przeciwwskazania: { ...prev.przeciwwskazania, [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/consent-forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
      } else {
        alert("Wystąpił błąd podczas zapisywania formularza. Spróbuj ponownie.");
      }
    } catch (error) {
      console.error("Błąd:", error);
      alert("Wystąpił błąd podczas zapisywania formularza. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5] flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif text-[#4a4540] mb-4">Dziękujemy!</h2>
          <p className="text-[#6b6560] mb-8">
            Twoja zgoda została pomyślnie zapisana. Skontaktujemy się z Tobą w celu potwierdzenia terminu zabiegu.
          </p>
          <button
            onClick={() => {
              setSubmitSuccess(false);
              setFormData(initialFormData);
            }}
            className="bg-[#8b7355] text-white px-8 py-3 rounded-xl hover:bg-[#7a6548] transition-colors"
          >
            Wypełnij ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5]">
      {/* Header */}
      <header className="bg-[#4a4540]/95 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif text-white tracking-wider">ROYAL LIPS</h1>
          <div className="flex items-center gap-4">
            <a href="tel:+48792377737" className="text-white/80 hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/makijazpermanentnykrosno/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-serif text-[#4a4540] mb-4 tracking-wide">
            Zgoda Klienta
          </h2>
          <p className="text-xl text-[#8b7355] font-light">
            na zabieg preparatem kwasu hialuronowego
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <p className="text-[#5a5550] leading-relaxed">
            Przed zabiegiem została przeprowadzona ze mną rozmowa, w której osoba przeprowadzająca zabieg
            poinformowała mnie wyczerpująco o wszelkich okolicznościach zabiegu, jego celu, sposobu jego
            przeprowadzenia, przeciwwskazaniach, ryzykach powikłania oraz udzieliła mi informacji co do
            wymaganego zachowania po zabiegu.
          </p>
          <p className="text-[#5a5550] leading-relaxed mt-4">
            <strong>Ustalono, iż celem zabiegu jest zastosowanie wypełnienia preparatem kwasu hialuronowego.</strong>
          </p>
          <p className="text-[#5a5550] leading-relaxed mt-4 text-sm italic">
            Poinformowano mnie, że efekty zabiegu uzależnione są od wielu czynników, w tym od biochemii i
            rodzaju skóry, miejsca iniekcji, wstrzykniętej ilości preparatu oraz techniki iniekcji, wobec czego nie da
            się w pełni zagwarantować oczekiwanych wyników zabiegu, ani że będą one identyczne w przypadku
            każdego klienta. Ilość zabiegów oraz ich efekt jest uwarunkowany dla każdej osoby indywidualnie.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Data */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#4a4540] mb-6 pb-3 border-b border-[#d4cec4]">
              Dane osobowe
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  required
                  value={formData.imieNazwisko}
                  onChange={(e) => handleInputChange("imieNazwisko", e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="Jan Kowalski"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Miejscowość / Data *
                </label>
                <input
                  type="text"
                  required
                  value={formData.miejscowoscData}
                  onChange={(e) => handleInputChange("miejscowoscData", e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="Krosno, 27.01.2026"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Adres
                </label>
                <input
                  type="text"
                  value={formData.adres}
                  onChange={(e) => handleInputChange("adres", e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="ul. Przykładowa 1, 38-400 Krosno"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Data urodzenia
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.dataUrodzenia}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="DD.MM.RRRR"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Telefon *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 py-3 bg-[#f0ebe4] border border-r-0 border-[#d4cec4] rounded-l-xl text-[#6b6560] font-medium select-none">
                    +48
                  </span>
                  <input
                    type="tel"
                    required
                    value={formData.telefon}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-r-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                    placeholder="123 456 789"
                    maxLength={11}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Procedure Details */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#4a4540] mb-6 pb-3 border-b border-[#d4cec4]">
              Szczegóły zabiegu
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Nazwa preparatu
                </label>
                <input
                  type="text"
                  value={formData.nazwaProduktu}
                  onChange={(e) => handleInputChange("nazwaProduktu", e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="Wstawić nazwę"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Obszar zabiegu
                </label>
                <input
                  type="text"
                  value={formData.obszarZabiegu}
                  onChange={(e) => handleInputChange("obszarZabiegu", e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="np. usta, bruzdy nosowo-wargowe"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  W celu uzyskania efektu
                </label>
                <input
                  type="text"
                  value={formData.celEfektu}
                  onChange={(e) => handleInputChange("celEfektu", e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="np. powiększenie ust, wygładzenie zmarszczek"
                />
              </div>
            </div>
            <p className="text-sm text-[#6b6560] mt-6 leading-relaxed">
              Zabieg z użyciem kwasu hialuronowego polega na wprowadzenie poprzez iniekcje odpowiedniej ilości
              preparatu w celu uzyskania odpowiedniego efektu estetycznego np. wygładzenie zmarszczek,
              powiększenie ust lub poprawa owalu twarzy.
            </p>
          </section>

          {/* Contraindications */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#4a4540] mb-4 pb-3 border-b border-[#d4cec4]">
              Przeciwwskazania do zabiegu
            </h3>
            <p className="text-sm text-[#6b6560] mb-6">
              Zostałem/am poinformowany/a o następujących przeciwwskazaniach do zabiegu, wobec czego oświadczam, że:
            </p>

            <div className="space-y-3">
              {(Object.keys(contraindicationLabels) as Array<keyof typeof contraindicationLabels>).map(
                (key, index) => (
                  <div
                    key={key}
                    className="flex items-start gap-4 p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors"
                  >
                    <span className="text-[#8b7355] font-medium min-w-[2rem]">{index + 1}.</span>
                    <p className="flex-1 text-[#5a5550] text-sm leading-relaxed">
                      {contraindicationLabels[key]}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleContraindicationChange(key, true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.przeciwwskazania[key] === true
                            ? "bg-red-500 text-white shadow-md"
                            : "bg-white/80 text-[#6b6560] hover:bg-red-100"
                        }`}
                      >
                        Tak
                      </button>
                      <button
                        type="button"
                        onClick={() => handleContraindicationChange(key, false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.przeciwwskazania[key] === false
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-white/80 text-[#6b6560] hover:bg-green-100"
                        }`}
                      >
                        Nie
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Natural Reactions - Collapsible */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("reakcje")}
              className="w-full p-6 md:p-8 flex justify-between items-center text-left hover:bg-white/40 transition-colors"
            >
              <h3 className="text-2xl font-serif text-[#4a4540]">
                Możliwe, naturalne reakcje organizmu na zabieg
              </h3>
              {expandedSections.reakcje ? (
                <ChevronUp className="w-6 h-6 text-[#8b7355]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#8b7355]" />
              )}
            </button>
            {expandedSections.reakcje && (
              <div className="px-6 md:px-8 pb-8">
                <p className="text-sm text-[#6b6560] mb-4">
                  Zostałem/am poinformowany/a o przebiegu zabiegu i możliwości naturalnego wystąpienia po zabiegu reakcji organizmu:
                </p>
                <ul className="space-y-2 text-[#5a5550] text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    obrzęk i szczypanie okolicy pozabiegowej utrzymujący się do 2 tygodni
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    zaczerwienienie i/lub zasinienie okolicy pozabiegowej utrzymujące się do tygodnia
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    wylewy, krwiaki, siniaki okolicy pozabiegowej utrzymujące się do 2 tygodni
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    tkliwość tkanek objętych zabiegiem utrzymująca się do około miesiąca
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    możliwe wyczuwanie materiału zabiegowego (grudki) przez okres do 2 tygodni
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    swędzenia w okresie gojenia
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* Complications - Collapsible */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("powiklania")}
              className="w-full p-6 md:p-8 flex justify-between items-center text-left hover:bg-white/40 transition-colors"
            >
              <h3 className="text-2xl font-serif text-[#4a4540]">Możliwe powikłania</h3>
              {expandedSections.powiklania ? (
                <ChevronUp className="w-6 h-6 text-[#8b7355]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#8b7355]" />
              )}
            </button>
            {expandedSections.powiklania && (
              <div className="px-6 md:px-8 pb-8">
                <p className="text-sm text-[#6b6560] mb-4">
                  Zostałem/am poinformowany/a o możliwości wystąpienia powikłań po zabiegu w postaci:
                </p>

                <div className="mb-6">
                  <h4 className="text-[#8b7355] font-medium mb-3">Ryzyko wystąpienia – częste:</h4>
                  <ul className="space-y-1 text-[#5a5550] text-sm ml-4">
                    <li>• przedłużający się obrzęk</li>
                    <li>• przedłużający się rumień</li>
                    <li>• zgrubienie w miejscu wprowadzenia preparatu</li>
                    <li>• wylewy krwawe</li>
                    <li>• migracja kwasu hialuronowego</li>
                    <li>• efekt Tyndalla</li>
                    <li>• przebarwienia w miejscu iniekcji</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="text-[#8b7355] font-medium mb-3">Ryzyko wystąpienia – rzadkie:</h4>
                  <ul className="space-y-1 text-[#5a5550] text-sm ml-4">
                    <li>• zakażenie wirusowe</li>
                    <li>• zakażenie bakteryjne</li>
                    <li>• zakażenia grzybicze</li>
                    <li>• nieregularna powierzchnia skóry zniekształcenie</li>
                    <li>• guzki na skórze</li>
                    <li>• opóźnione stany zapalne</li>
                    <li>• ropnie i owrzodzenia</li>
                    <li>• widoczna asymetria</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#8b7355] font-medium mb-3">Ryzyko wystąpienia – bardzo rzadkie:</h4>
                  <ul className="space-y-1 text-[#5a5550] text-sm ml-4">
                    <li>• martwica skóry</li>
                    <li>• zatory w obrębie naczyń krwionośnych i limfatycznych</li>
                    <li>• tworzenie się ziarniniaków</li>
                    <li>• ucisk na lokalne naczynia krwionośne</li>
                    <li>• obrzęk naczynioruchowy</li>
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Post-procedure Obligations - Collapsible */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("zalecenia")}
              className="w-full p-6 md:p-8 flex justify-between items-center text-left hover:bg-white/40 transition-colors"
            >
              <h3 className="text-2xl font-serif text-[#4a4540]">Zobowiązania pozabiegowe</h3>
              {expandedSections.zalecenia ? (
                <ChevronUp className="w-6 h-6 text-[#8b7355]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#8b7355]" />
              )}
            </button>
            {expandedSections.zalecenia && (
              <div className="px-6 md:px-8 pb-8">
                <p className="text-sm text-[#6b6560] mb-4">
                  Zostałem/am poinformowany/a o konieczności stosowania się do następujących zaleceń pozabiegowych,
                  których nieprzestrzeganie może spowodować poważne powikłania:
                </p>
                <ul className="space-y-2 text-[#5a5550] text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Stosowanie preparatu pozabiegowego: <strong>MAŚĆ ARNIKOWA</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Miejsce poddane zabiegowi traktować ze szczególną ostrożnością
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Nie dotykać ani nie masować miejsc poddanych zabiegowi
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Zachować wysoką higienę dłoni, istnieje bowiem duże ryzyko wtórnego zakażenia
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Nie przemywać mydłem i środkami złuszczającymi miejsc poddanych wypełnieniu przez min. 2 tygodni
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Unikać silnej ekspozycji słonecznej przez 6 tygodni i stosować kremy z wysokim filtrem UV
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Nie korzystać z solarium przez okres 2 tygodni
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Nie korzystać z sauny, basenu czy krioterapii przez okres 1 tygodnia
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Unikać alkoholu przez okres min. 48 godzin po zabiegu
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Unikać gorących napojów w dniu zabiegu (dotyczy modelowania ust)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Unikać wzmożonego wysiłku fizycznego przez około dwie doby
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Unikać spania przez kilka dni w pozycji mogącej spowodować uciśnięcie miejsca podania kwasu hialuronowego
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8b7355]">•</span>
                    Nie poddawać się zabiegom peelingu chemicznego i mechanicznego przez okres 2 tygodni od zabiegu
                  </li>
                </ul>

                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-amber-800 font-medium">UWAGA!</p>
                  <p className="text-amber-700 text-sm mt-2">
                    Stosować się ściśle do zaleceń pozabiegowych. Przez 4 doby po zabiegu należy pić dużo wody,
                    minimum 2,5 litra dziennie.
                  </p>
                  <p className="text-amber-700 text-sm mt-2">
                    Utrzymywanie się reakcji zapalnych przez okres dłuższy niż 7 dni lub wystąpienie jakichkolwiek
                    reakcji niepożądanych należy niezwłocznie zgłosić.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Declarations and Consents */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#4a4540] mb-6 pb-3 border-b border-[#d4cec4]">
              Oświadczenia i zgoda na zabieg
            </h3>

            <div className="bg-[#f8f6f3] p-6 rounded-xl mb-6">
              <p className="text-[#5a5550] leading-relaxed">
                Oświadczam, że przeczytałem/am ze zrozumieniem całe powyższe oświadczenie oraz że świadomie i
                dobrowolnie poddaję się zabiegowi. Treść tego dokumentu była ze mną szczegółowo omówiona przed
                zabiegiem. Miałem/am możliwość zadawania pytań i uzyskałem/am wyczerpujące odpowiedzi.
                Procedury zabiegu zostały mi przedstawione w sposób przystępny.
              </p>
            </div>

            <div className="space-y-6">
              {/* Data Processing Consent */}
              <div className="p-4 bg-white/50 rounded-xl">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.zgodaPrzetwarzanieDanych}
                    onChange={(e) => handleInputChange("zgodaPrzetwarzanieDanych", e.target.checked)}
                    className="w-5 h-5 mt-1 text-[#8b7355] rounded border-[#d4cec4] focus:ring-[#8b7355]"
                    required
                  />
                  <span className="text-sm text-[#5a5550] leading-relaxed">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych, przez Studio Makijażu Permanentnego
                    Royal Lips Joanna Wielgos, ul. Pużaka 37, 38-400 Krosno, NIP: 6842237473 w celu realizacji
                    umowy o wykonanie zabiegu preparatem kwasu hialuronowego. Zgodę wyrażam w sposób świadomy
                    i dobrowolny, a podane przeze mnie dane są zgodne z prawdą. *
                  </span>
                </label>
                {formData.zgodaPrzetwarzanieDanych && (
                  <div className="mt-4 ml-9">
                    <SignaturePad
                      label="Podpis potwierdzający zgodę na przetwarzanie danych"
                      value={formData.podpisDane}
                      onChange={(sig) => handleInputChange("podpisDane", sig)}
                      date={formData.miejscowoscData}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Marketing Consent */}
              <div className="p-4 bg-white/50 rounded-xl">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.zgodaMarketing}
                    onChange={(e) => handleInputChange("zgodaMarketing", e.target.checked)}
                    className="w-5 h-5 mt-1 text-[#8b7355] rounded border-[#d4cec4] focus:ring-[#8b7355]"
                  />
                  <span className="text-sm text-[#5a5550] leading-relaxed">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych, przez Studio Makijażu Permanentnego
                    Royal Lips Joanna Wielgos, ul. Pużaka 37, 38-400 Krosno, NIP: 6842237473 w celach marketingowych.
                    Zgodę wyrażam w sposób świadomy i dobrowolny, a podane przeze mnie dane są zgodne z prawdą.
                  </span>
                </label>
                {formData.zgodaMarketing && (
                  <div className="mt-4 ml-9">
                    <SignaturePad
                      label="Podpis potwierdzający zgodę marketingową"
                      value={formData.podpisMarketing}
                      onChange={(sig) => handleInputChange("podpisMarketing", sig)}
                      date={formData.miejscowoscData}
                    />
                  </div>
                )}
              </div>

              {/* Photography Consent */}
              <div className="p-4 bg-white/50 rounded-xl">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.zgodaFotografie}
                    onChange={(e) => handleInputChange("zgodaFotografie", e.target.checked)}
                    className="w-5 h-5 mt-1 text-[#8b7355] rounded border-[#d4cec4] focus:ring-[#8b7355]"
                  />
                  <span className="text-sm text-[#5a5550] leading-relaxed">
                    Wyrażam zgodę na wykonanie fotografii ciała w celu dokumentacji oraz oceny efektywności
                    zabiegu i wyrażam zgodę na umieszczenie fotografii.
                  </span>
                </label>
                {formData.zgodaFotografie && (
                  <div className="mt-4 ml-9 space-y-4">
                    <div>
                      <label className="block text-sm text-[#6b6560] mb-2">
                        Miejsca publikacji fotografii (np. www, Facebook, Instagram itd.)
                      </label>
                      <input
                        type="text"
                        value={formData.miejscaPublikacjiFotografii}
                        onChange={(e) => handleInputChange("miejscaPublikacjiFotografii", e.target.value)}
                        className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                        placeholder="Instagram, Facebook, strona www"
                      />
                    </div>
                    <SignaturePad
                      label="Podpis potwierdzający zgodę na fotografię"
                      value={formData.podpisFotografie}
                      onChange={(sig) => handleInputChange("podpisFotografie", sig)}
                      date={formData.miejscowoscData}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RODO Information - Collapsible */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("rodo")}
              className="w-full p-6 md:p-8 flex justify-between items-center text-left hover:bg-white/40 transition-colors"
            >
              <h3 className="text-2xl font-serif text-[#4a4540]">Klauzula informacyjna RODO</h3>
              {expandedSections.rodo ? (
                <ChevronUp className="w-6 h-6 text-[#8b7355]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#8b7355]" />
              )}
            </button>
            {expandedSections.rodo && (
              <div className="px-6 md:px-8 pb-8 text-sm text-[#5a5550] space-y-4">
                <p>
                  Zgodnie z art. 13 ust. 1-2 Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia
                  27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych
                  i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie
                  o ochronie danych) (dalej „RODO") informuję, że:
                </p>

                <div className="space-y-3">
                  <p>
                    <strong>I.</strong> Administratorem Pani/Pana danych osobowych jest <strong>Joanna Wielgos</strong>,
                    prowadząca działalność gospodarczą pod nazwą: <strong>Royal Lips Studio Makijażu Permanentnego</strong>,
                    ul. Pużaka 37, 38-400 Krosno, REGON 180685260, NIP 6842237473
                  </p>

                  <p>
                    <strong>II.</strong> Będę przetwarzać Pani/Pana dane wyłącznie w celu wykonania umowy o wykonanie zabiegu
                    kosmetycznego, w zakresie wynikającym ze zlecenia, i objętej zgodą na podstawie Oświadczenia o wyrażeniu
                    zgody na wykonanie zabiegu kosmetycznego, zgodnie z zasadami wymienionymi w art. 5. Niedopuszczalne jest
                    przetwarzanie Pani/Pana danych w celu marketingu bezpośredniego.
                  </p>

                  <p>
                    <strong>III. Prawo do sprzeciwu</strong><br />
                    W każdej chwili przysługuje Pani/Panu prawo do wniesienia sprzeciwu wobec przetwarzania Pani/Pana
                    danych, przetwarzanych w celu i na podstawie wskazanych powyżej. Przestaniemy przetwarzać Pani/Pana
                    dane w tych celach, chyba że będziemy w stanie wykazać, że istnieją ważne, prawnie uzasadnione podstawy,
                    które są nadrzędne wobec Pani/Pana interesów, praw i wolności lub Pani/Pana dane będą nam niezbędne
                    do ewentualnego ustalenia, dochodzenia lub obrony roszczeń.
                  </p>

                  <p>
                    <strong>IV.</strong> Będę przechowywać dane przez okres niezbędny dla prawidłowego wykonania umowy,
                    nie dłużej jednak niż do przedawnienia dochodzenia roszczenia lub zgłoszenia szkody.
                  </p>

                  <p>
                    <strong>V.</strong> Pani/Pana dane osobowe mogą zostać przekazywane wyłącznie pracownikom księgowości/biura
                    rachunkowego, na których przepisy nakładają obowiązek zachowania tajemnicy – tylko w celu umożliwienia
                    rozliczenia wykonanego zabiegu, wystawienia faktury, rachunku imiennego, lub pracownikom przedsiębiorstwa
                    Joanna Wielgos Royal Lips Studio Makijażu Permanentnego. (ul. Pużaka 37, 38-400 Krosno), którym powierzono
                    pisemnie przetwarzanie danych osobowych i którzy ponoszą odpowiedzialność za naruszenie zasad przetwarzania.
                  </p>

                  <p>
                    <strong>VI. Zgodnie z RODO, przysługuje Pani/Panu prawo do:</strong>
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>dostępu do swoich danych oraz otrzymania ich kopii</li>
                    <li>sprostowania (poprawiania) swoich danych</li>
                    <li>żądania usunięcia, ograniczenia lub wniesienia sprzeciwu wobec ich przetwarzania</li>
                    <li>przenoszenia danych</li>
                    <li>wniesienia skargi do organu nadzorczego</li>
                  </ul>

                  <p>
                    <strong>VII.</strong> Podanie danych jest dobrowolne z tym, że odmowa ich podania może uniemożliwić
                    wykonanie zabiegu w ramach usług oferowanych Klientom, i stanowi podstawę odmowy ich wykonania.
                  </p>

                  <p>
                    <strong>VIII.</strong> Informuję, że nie podejmuję decyzji w sposób zautomatyzowany i Pani/Pana dane
                    nie są profilowane.
                  </p>

                  <p>
                    <strong>IX.</strong> W każdej chwili przysługuje Pani/Panu prawo do wycofania zgody na przetwarzanie
                    Pani/Pana danych osobowych (w tym należących do szczególnej kategorii), ale cofnięcie zgody nie wpływa
                    na zgodność z prawem przetwarzania, którego dokonano zgodnie z prawem, przed jej wycofaniem.
                  </p>
                </div>

                <div className="mt-6 p-4 bg-[#f8f6f3] rounded-xl">
                  <p className="text-[#5a5550]">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych, przez Royal Lips Studio Makijażu
                    Permanentnego Joanna Wielgos w celu udzielenia mi pomocy prawnej.
                  </p>
                </div>

                <div className="mt-6">
                  <SignaturePad
                    label="Podpis potwierdzający zapoznanie się z klauzulą RODO"
                    value={formData.podpisRodo}
                    onChange={(sig) => handleInputChange("podpisRodo", sig)}
                    date={formData.miejscowoscData}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !formData.zgodaPrzetwarzanieDanych}
              className="w-full bg-[#8b7355] text-white py-5 rounded-2xl text-lg font-medium tracking-wide hover:bg-[#7a6548] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Wysyłanie...
                </span>
              ) : (
                "Wyślij zgodę"
              )}
            </button>
            <p className="text-center text-sm text-[#6b6560] mt-4">
              * Pola oznaczone gwiazdką są wymagane
            </p>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-[#4a4540] text-white py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-serif tracking-wider mb-4">ROYAL LIPS</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Studio Makijażu Permanentnego<br />
                Joanna Wielgos<br />
                ul. Pużaka 37<br />
                38-400 Krosno
              </p>
              <p className="text-white/50 text-xs mt-4">
                NIP: 6842237473 | REGON: 180685260
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Kontakt</h4>
              <div className="space-y-3">
                <a
                  href="tel:+48792377737"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>+48 792 377 737</span>
                </a>
                <a
                  href="mailto:kontakt@royallips.pl"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>kontakt@royallips.pl</span>
                </a>
                <a
                  href="https://www.instagram.com/makijazpermanentnykrosno/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@makijazpermanentnykrosno</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/50 text-xs">
              © 2026 Royal Lips. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
