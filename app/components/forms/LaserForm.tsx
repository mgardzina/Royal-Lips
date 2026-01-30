"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  ArrowLeft,
  Mail,
  Instagram,
  Phone,
} from "lucide-react";
import SignaturePad from "../../../components/SignaturePad";
import Footer from "@/app/components/Footer";
import {
  ConsentFormData,
  laserContraindications,
  laserNaturalReactions,
  laserComplications,
  laserPostCare,
  rodoInfo,
} from "../../../types/booking";

interface LaserFormProps {
  onBack: () => void;
}

const initialFormData: ConsentFormData = {
  type: "LASER",
  imieNazwisko: "",
  ulica: "",
  kodPocztowy: "",
  miasto: "",
  dataUrodzenia: "",
  telefon: "",
  miejscowoscData: "",
  osobaPrzeprowadzajacaZabieg: "",
  nazwaProduktu: "",
  obszarZabiegu: "",
  celEfektu: "",
  numerZabiegu: "",
  przeciwwskazania: Object.keys(laserContraindications).reduce(
    (acc, key) => ({ ...acc, [key]: null }),
    {},
  ),
  zgodaPrzetwarzanieDanych: false,
  zgodaMarketing: false,
  zgodaFotografie: false,
  zgodaPomocPrawna: false,
  miejscaPublikacjiFotografii: "",
  podpisDane: "",
  podpisMarketing: "",
  podpisFotografie: "",
  podpisRodo: "",
  informacjaDodatkowa: "",
  zastrzeniaKlienta: "",
};

export default function LaserForm({ onBack }: LaserFormProps) {
  const [formData, setFormData] = useState<ConsentFormData>(initialFormData);
  const [email, setEmail] = useState(""); // Lokalny stan dla maila
  const [expandedSections, setExpandedSections] = useState({
    reakcje: false,
    powiklania: false,
    zalecenia: false,
    rodo: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentContraindicationIndex, setCurrentContraindicationIndex] =
    useState(0);
  const [showContraindicationsWizard, setShowContraindicationsWizard] =
    useState(true);

  const contraindicationKeys = Object.keys(laserContraindications);
  const currentContraindicationKey =
    contraindicationKeys[currentContraindicationIndex];
  const isWizardComplete =
    currentContraindicationIndex === contraindicationKeys.length;

  const handleWizardAnswer = (value: boolean) => {
    handleContraindicationChange(currentContraindicationKey, value);
    if (currentContraindicationIndex < contraindicationKeys.length) {
      setCurrentContraindicationIndex((prev) => prev + 1);
    }
  };

  const resetWizard = () => {
    setCurrentContraindicationIndex(0);
    setShowContraindicationsWizard(true);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (
    field: keyof ConsentFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ... helpersy (format phone, date, contraindications) - takie same ...
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

  const handleContraindicationChange = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      przeciwwskazania: { ...prev.przeciwwskazania, [key]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionData = {
      ...formData,
      email: email || null,
    };

    try {
      const response = await fetch("/api/consent-forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
      } else {
        alert(
          "Wystąpił błąd podczas zapisywania formularza. Spróbuj ponownie.",
        );
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
          <h2 className="text-3xl font-serif text-[#4a4540] mb-4">
            Dziękujemy!
          </h2>
          <p className="text-[#6b6560] mb-8">Twój formularz został zapisany.</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setFormData(initialFormData);
                setEmail("");
                window.scrollTo(0, 0);
              }}
              className="bg-[#8b7355] text-white px-8 py-3 rounded-xl hover:bg-[#7a6548] transition-colors"
            >
              Wypełnij ponownie
            </button>
            <button
              onClick={onBack}
              className="text-[#8b7355] px-8 py-2 hover:text-[#7a6548] transition-colors"
            >
              Wróć do wyboru zabiegu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5]">
      {/* Header */}
      <header className="bg-[#4a4540]/95 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-serif text-white tracking-wider">
              ROYAL LIPS
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+48792377737"
              className="text-white/80 hover:text-white transition-colors"
            >
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
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-[#4a4540] mb-4 tracking-wide">
            Laser Q-Switch
          </h2>
          <p className="text-xl text-[#8b7355] font-light">
            Zgoda na zabieg laserowy
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dane osobowe */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-8">
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
                  onChange={(e) =>
                    handleInputChange("imieNazwisko", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="Joanna Wielgos"
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
                  onChange={(e) =>
                    handleInputChange("miejscowoscData", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="Krosno, 27.01.2026"
                />
              </div>
              {/* Email field - positioned 3rd to match PmuForm */}
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Adres E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8580]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                    placeholder="kontakt@royallips.pl"
                  />
                </div>
              </div>

              {/* Address Section - col-span-2 within the same grid */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                    Ulica i numer
                  </label>
                  <input
                    type="text"
                    value={formData.ulica}
                    onChange={(e) => handleInputChange("ulica", e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl"
                    placeholder="ul. Przykładowa 1/2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                    Kod pocztowy
                  </label>
                  <input
                    type="text"
                    value={formData.kodPocztowy}
                    onChange={(e) =>
                      handleInputChange("kodPocztowy", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl"
                    placeholder="38-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                    Miasto
                  </label>
                  <input
                    type="text"
                    value={formData.miasto}
                    onChange={(e) =>
                      handleInputChange("miasto", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl"
                    placeholder="Krosno"
                  />
                </div>
              </div>

              {/* DOB and Phone - continued in the same grid */}
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Data urodzenia
                </label>
                <input
                  type="text"
                  value={formData.dataUrodzenia}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl"
                  placeholder="DD.MM.RRRR"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Telefon
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

          {/* Zakres Zabiegu Laser */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-8">
            <h3 className="text-2xl font-serif text-[#4a4540] mb-6 pb-3 border-b border-[#d4cec4]">
              Zakres zabiegu
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Użycie lasera Q-switch w obszarze
                </label>
                <input
                  type="text"
                  value={formData.obszarZabiegu}
                  onChange={(e) =>
                    handleInputChange("obszarZabiegu", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="np. Twarz, Ramię"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Uzyskanie efektu
                </label>
                <input
                  type="text"
                  value={formData.celEfektu}
                  onChange={(e) =>
                    handleInputChange("celEfektu", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="np. Usunięcia tatuażu"
                />
              </div>
              <div className="p-4 bg-white/50 rounded-xl">
                <p className="text-sm text-[#5a5550]">
                  Efekt jest indywidualny i zależy od skóry i głębokości
                  pigmentu.
                </p>
              </div>
            </div>
          </section>

          {/* Wywiad Medyczny Laser */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-8">
            <h3 className="text-2xl font-serif text-[#4a4540] mb-4 pb-3 border-b border-[#d4cec4]">
              Wywiad Medyczny
            </h3>
            <p className="text-sm text-[#6b6560] mb-6">
              Czy posiadasz którekolwiek z poniższych przeciwwskazań?
            </p>
            <div className="space-y-3">
              {showContraindicationsWizard && !isWizardComplete ? (
                <div
                  key={currentContraindicationIndex}
                  className="bg-[#f8f6f3] p-6 rounded-xl border border-[#d4cec4] max-w-2xl mx-auto shadow-sm"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-medium text-[#8b7355]">
                      Pytanie {currentContraindicationIndex + 1} z{" "}
                      {contraindicationKeys.length}
                    </span>
                    <div className="h-2 w-24 bg-[#d4cec4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8b7355] transition-all duration-300"
                        style={{
                          width: `${((currentContraindicationIndex + 1) / contraindicationKeys.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <h4 className="text-xl md:text-2xl font-serif text-[#4a4540] mb-8 min-h-[5rem] flex items-center justify-center text-center">
                    {laserContraindications[currentContraindicationKey]}
                  </h4>

                  <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={() => handleWizardAnswer(false)}
                      className="py-4 px-6 rounded-xl bg-white border-2 border-[#d4cec4] text-[#6b6560] active:border-green-500 active:bg-green-500 active:text-white md:hover:border-green-500 md:hover:bg-green-500 md:hover:text-white transition-all text-lg font-medium shadow-sm hover:shadow-md active:scale-95 flex flex-col items-center justify-center gap-2"
                    >
                      <span className="text-2xl">✕</span>
                      NIE
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWizardAnswer(true)}
                      className="py-4 px-6 rounded-xl bg-white border-2 border-[#d4cec4] text-[#6b6560] active:border-red-500 active:bg-red-500 active:text-white md:hover:border-red-500 md:hover:bg-red-500 md:hover:text-white transition-all text-lg font-medium shadow-sm hover:shadow-md active:scale-95 flex flex-col items-center justify-center gap-2"
                    >
                      <span className="text-2xl">!</span>
                      TAK
                    </button>
                  </div>

                  <div className="mt-8 flex justify-between items-center border-t border-[#d4cec4]/50 pt-6">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentContraindicationIndex((prev) =>
                          Math.max(0, prev - 1),
                        )
                      }
                      disabled={currentContraindicationIndex === 0}
                      className="flex items-center gap-2 text-sm text-[#8b8580] disabled:opacity-0 hover:text-[#8b7355] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Poprzednie
                    </button>
                    <span className="text-xs text-[#d4cec4] uppercase tracking-wider font-medium">
                      Krok {currentContraindicationIndex + 1}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-green-800 font-medium">
                        Wywiad medyczny zakończony
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={resetWizard}
                      className="text-sm text-green-700 hover:text-green-900 font-medium underline"
                    >
                      Edytuj odpowiedzi
                    </button>
                  </div>

                  {Object.entries(laserContraindications).map(
                    ([key, label], index) => (
                      <div
                        key={key}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                          formData.przeciwwskazania[key]
                            ? "bg-red-50 border border-red-100"
                            : "bg-green-50/50 border border-green-100/50"
                        }`}
                      >
                        <span className="text-[#8b7355] font-medium min-w-[1.5rem] mt-0.5">
                          {index + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="text-[#5a5550] text-sm leading-relaxed">
                            {label}
                          </p>
                        </div>
                        <div className="ml-2">
                          {formData.przeciwwskazania[key] ? (
                            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200 whitespace-nowrap">
                              TAK
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 whitespace-nowrap">
                              NIE
                            </span>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Ryzyko Laser */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("reakcje")}
              className="w-full p-6 md:p-8 flex justify-between items-center text-left hover:bg-white/40 transition-colors"
            >
              <h3 className="text-2xl font-serif text-[#4a4540]">
                Świadomość ryzyka
              </h3>
              {expandedSections.reakcje ? (
                <ChevronUp className="w-6 h-6 text-[#8b7355]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#8b7355]" />
              )}
            </button>
            {expandedSections.reakcje && (
              <div className="px-6 md:px-8 pb-8 space-y-4">
                <p className="text-sm text-[#6b6560]">
                  Zostałam/em poinformowana/y o przebiegu zabiegu i możliwości
                  naturalnego wystąpienia po zabiegu reakcji organizmu:
                </p>

                <div className="p-4 bg-white/50 rounded-xl">
                  <p className="text-sm font-medium text-[#4a4540] mb-3">
                    Możliwe naturalne reakcje na zabieg:
                  </p>
                  <ul className="space-y-2 text-sm text-[#5a5550]">
                    {laserNaturalReactions.map((reaction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#8b7355]">•</span>
                        {reaction}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white/50 rounded-xl">
                  <p className="text-sm font-medium text-[#4a4540] mb-3">
                    Możliwe powikłania:
                  </p>
                  <div className="space-y-3 text-sm text-[#5a5550]">
                    <div>
                      <p className="text-xs font-medium text-[#6b6560] mb-1">
                        Ryzyko wystąpienia - częste:
                      </p>
                      <p>{laserComplications.czeste.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6b6560] mb-1">
                        Ryzyko wystąpienia - rzadkie:
                      </p>
                      <p>{laserComplications.rzadkie.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#6b6560] mb-1">
                        Ryzyko wystąpienia - bardzo rzadkie:
                      </p>
                      <p>{laserComplications.bardzoRzadkie.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Zalecenia Laser */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("zalecenia")}
              className="w-full p-6 md:p-8 flex justify-between items-center text-left hover:bg-white/40 transition-colors"
            >
              <h3 className="text-2xl font-serif text-[#4a4540]">
                Zobowiązania pozabiegowe
              </h3>
              {expandedSections.zalecenia ? (
                <ChevronUp className="w-6 h-6 text-[#8b7355]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#8b7355]" />
              )}
            </button>
            {expandedSections.zalecenia && (
              <div className="px-6 md:px-8 pb-8">
                <p className="text-sm text-[#6b6560] mb-4">
                  Zostałam/em poinformowana/y o konieczności stosowania się do
                  następujących zaleceń pozabiegowych, których nieprzestrzeganie
                  może spowodować poważne powikłania, i przyjmuję je do
                  stosowania:
                </p>
                <ul className="space-y-2 text-[#5a5550] text-sm">
                  {laserPostCare.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#8b7355]">•</span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* RODO - Klauzula informacyjna */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("rodo")}
              className="w-full p-4 md:p-8 flex justify-between items-center text-left hover:bg-white/40 transition-colors"
            >
              <h3 className="text-2xl font-serif text-[#4a4540]">
                Klauzula Informacyjna RODO
              </h3>
              {expandedSections.rodo ? (
                <ChevronUp className="w-6 h-6 text-[#8b7355]" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#8b7355]" />
              )}
            </button>
            {expandedSections.rodo && (
              <div className="px-6 md:px-8 pb-8">
                <div className="bg-[#f8f6f3] p-4 rounded-xl text-xs text-[#5a5550] leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
                  {rodoInfo.pelnyTekst}
                </div>
              </div>
            )}
          </section>

          {/* Oświadczenia i zgody */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-8">
            <h3 className="text-2xl font-serif text-[#4a4540] mb-6 pb-3 border-b border-[#d4cec4]">
              Oświadczenia i Zgoda na Zabieg
            </h3>
            <div className="bg-[#f8f6f3] p-4 rounded-xl mb-6">
              <p className="text-sm text-[#5a5550] leading-relaxed">
                <strong>Oświadczam, że:</strong>
              </p>
              <ol className="list-decimal ml-5 mt-2 text-sm text-[#5a5550] space-y-2">
                <li>
                  Jestem świadoma/y przebiegu zabiegu, jego celu, oraz
                  okoliczności jego przeprowadzenia i zasad obowiązujących po
                  wykonaniu zabiegu, oraz że świadomie i dobrowolnie poddaję się
                  zabiegowi.
                </li>
                <li>
                  Osoba przeprowadzająca zabieg poinformowała mnie o powyższych
                  okolicznościach, oraz udzieliła mi niezbędnych odpowiedzi oraz
                  wszelkich informacji co do zachowania po zabiegu, oraz w
                  zakresie zadawanych przez mnie pytań, i nie wnoszę do tej
                  informacji zastrzeżeń, oraz że są one dla mnie w pełni
                  zrozumiałe.
                </li>
                <li>
                  Podane przeze mnie w niniejszym oświadczeniu odpowiedzi, w
                  szczególności co do stanu zdrowia, oraz braku ewentualnych
                  przeciwwskazań są zgodne z prawdą, i opierają się na mojej
                  wiedzy co do stanu mojego zdrowia, bez zatajania czegokolwiek.
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              {/* Zgoda na przetwarzanie danych */}
              <div className="p-4 bg-white/50 rounded-xl">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.zgodaPrzetwarzanieDanych}
                    onChange={(e) =>
                      handleInputChange(
                        "zgodaPrzetwarzanieDanych",
                        e.target.checked,
                      )
                    }
                    className="w-5 h-5 mt-1 text-[#8b7355] rounded border-[#d4cec4] focus:ring-[#8b7355]"
                    required
                  />
                  <span className="text-sm text-[#5a5550] leading-relaxed">
                    <strong>Wymagane:</strong>Wyrażam zgodę na przetwarzanie
                    moich danych osobowych przez {rodoInfo.firmaNazwa}{" "}
                    {rodoInfo.administrator}, {rodoInfo.adres}, NIP:{" "}
                    {rodoInfo.nip} w celu realizacji umowy o wykonanie zabiegu z
                    użyciem lasera Q-switch. Zgodę wyrażam w sposób świadomy i
                    dobrowolny, a podane przeze mnie dane są zgodne z prawdą.
                  </span>
                </label>
                {formData.zgodaPrzetwarzanieDanych && (
                  <div className="mt-4 ml-9">
                    <SignaturePad
                      label="Podpis - Oświadczenie i zgoda na zabieg"
                      value={formData.podpisDane}
                      onChange={(sig) => handleInputChange("podpisDane", sig)}
                      date={formData.miejscowoscData}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Zgoda na marketing (opcjonalna) */}
              <div className="p-4 bg-white/50 rounded-xl">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.zgodaMarketing}
                    onChange={(e) =>
                      handleInputChange("zgodaMarketing", e.target.checked)
                    }
                    className="w-5 h-5 mt-1 text-[#8b7355] rounded border-[#d4cec4] focus:ring-[#8b7355]"
                  />
                  <span className="text-sm text-[#5a5550] leading-relaxed">
                    <strong>Opcjonalnie:</strong> Wyrażam zgodę na przetwarzanie
                    moich danych osobowych przez {rodoInfo.firmaNazwa}{" "}
                    {rodoInfo.administrator}, {rodoInfo.adres}, NIP:{" "}
                    {rodoInfo.nip} w celach marketingowych. Zgodę wyrażam w
                    sposób świadomy i dobrowolny, a podane przeze mnie dane są
                    zgodne z prawdą.
                  </span>
                </label>
                {formData.zgodaMarketing && (
                  <div className="mt-4 ml-9">
                    <SignaturePad
                      label="Podpis zgody marketingowej"
                      value={formData.podpisMarketing}
                      onChange={(sig) =>
                        handleInputChange("podpisMarketing", sig)
                      }
                      date={formData.miejscowoscData}
                    />
                  </div>
                )}
              </div>

              {/* Zgoda na wizerunek (opcjonalna) */}
              <div className="p-4 bg-white/50 rounded-xl">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.zgodaFotografie}
                    onChange={(e) =>
                      handleInputChange("zgodaFotografie", e.target.checked)
                    }
                    className="w-5 h-5 mt-1 text-[#8b7355] rounded border-[#d4cec4] focus:ring-[#8b7355]"
                  />
                  <span className="text-sm text-[#5a5550] leading-relaxed">
                    <strong>Opcjonalnie:</strong> Wyrażam zgodę na wykonanie
                    fotografii ciała w celu dokumentacji oraz oceny efektywności
                    zabiegu i wyrażam zgodę na umieszczenie fotografii w celach
                    promocji firmy.
                  </span>
                </label>
                {formData.zgodaFotografie && (
                  <div className="mt-4 ml-9 space-y-4">
                    <div>
                      <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                        Miejsca publikacji (np. www, Facebook, Instagram)
                      </label>
                      <input
                        type="text"
                        value={formData.miejscaPublikacjiFotografii}
                        onChange={(e) =>
                          handleInputChange(
                            "miejscaPublikacjiFotografii",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                        placeholder="www, Facebook, Instagram"
                      />
                    </div>
                    <SignaturePad
                      label="Podpis zgody na wizerunek"
                      value={formData.podpisFotografie}
                      onChange={(sig) =>
                        handleInputChange("podpisFotografie", sig)
                      }
                      date={formData.miejscowoscData}
                    />
                  </div>
                )}
              </div>

              {/* Zgoda na pomoc prawną (opcjonalna) */}
              <div className="p-4 bg-white/50 rounded-xl">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.zgodaPomocPrawna}
                    onChange={(e) =>
                      handleInputChange("zgodaPomocPrawna", e.target.checked)
                    }
                    className="w-5 h-5 mt-1 text-[#8b7355] rounded border-[#d4cec4] focus:ring-[#8b7355]"
                  />
                  <span className="text-sm text-[#5a5550] leading-relaxed">
                    <strong>Opcjonalnie:</strong> Wyrażam zgodę na przetwarzanie
                    moich danych osobowych przez {rodoInfo.firmaNazwa}{" "}
                    {rodoInfo.administrator} w celu udzielenia mi pomocy
                    prawnej.
                  </span>
                </label>
                {formData.zgodaPomocPrawna && (
                  <div className="mt-4 ml-9">
                    <SignaturePad
                      label="Podpis zgody na pomoc prawną"
                      value={formData.podpisRodo}
                      onChange={(sig) => handleInputChange("podpisRodo", sig)}
                      date={formData.miejscowoscData}
                    />
                  </div>
                )}
              </div>

              {/* Informacja dodatkowa */}
              <div className="p-4 bg-white/50 rounded-xl">
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Informacja dodatkowa / Zastrzeżenia klienta (opcjonalnie)
                </label>
                <textarea
                  value={formData.informacjaDodatkowa || ""}
                  onChange={(e) =>
                    handleInputChange("informacjaDodatkowa", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="Stwierdzone nieprawidłowości po zabiegu, zastrzeżenia klienta..."
                  rows={3}
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.zgodaPrzetwarzanieDanych ||
                  !formData.podpisDane
                }
                className="w-full bg-[#8b7355] text-white py-5 rounded-2xl text-lg font-medium tracking-wide hover:bg-[#7a6548] disabled:opacity-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting ? "Zapisywanie..." : "Zapisz Zgodę"}
              </button>
            </div>
          </section>
        </form>
      </main>

      <Footer />
    </div>
  );
}
