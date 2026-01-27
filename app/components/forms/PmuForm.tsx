"use client";

import { useState } from "react";
import {
  Instagram,
  Phone,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowLeft,
} from "lucide-react";
import SignaturePad from "../../../components/SignaturePad";
import { ConsentFormData, pmuContraindications } from "../../../types/booking";

interface PmuFormProps {
  onBack: () => void;
}

const initialFormData: ConsentFormData = {
  type: "PMU",
  imieNazwisko: "",
  ulica: "",
  kodPocztowy: "",
  miasto: "",
  dataUrodzenia: "",
  telefon: "",
  miejscowoscData: "",
  nazwaProduktu: "", // Nie dotyczy, ale wypełnimy "Pigment"
  obszarZabiegu: "",
  celEfektu: "", // "Makijaż permanentny w obszarze..."
  przeciwwskazania: Object.keys(pmuContraindications).reduce(
    (acc, key) => ({ ...acc, [key]: null }),
    {},
  ),
  zgodaPrzetwarzanieDanych: false,
  zgodaMarketing: false,
  zgodaFotografie: false,
  miejscaPublikacjiFotografii: "",
  podpisDane: "",
  podpisMarketing: "",
  podpisFotografie: "",
  podpisRodo: "",
};

export default function PmuForm({ onBack }: PmuFormProps) {
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

  const handleInputChange = (
    field: keyof ConsentFormData,
    value: string | boolean,
  ) => {
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

  const handleContraindicationChange = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      przeciwwskazania: { ...prev.przeciwwskazania, [key]: value },
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
              ROYAL LIPS - PMU
            </h1>
          </div>
          {/* Socials ... */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-[#4a4540] mb-4 tracking-wide">
            Makijaż Permanentny
          </h2>
          <p className="text-xl text-[#8b7355] font-light">
            Zgoda na zabieg pigmentacji
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dane osobowe */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#4a4540] mb-6 pb-3 border-b border-[#d4cec4]">
              Dane osobowe
            </h3>
            {/* Same inputy co wcześniej ... */}
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
                  onChange={(e) =>
                    handleInputChange("miejscowoscData", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="Krosno, 27.01.2026"
                />
              </div>
              {/* Adres */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                    Ulica i numer domu/mieszkania
                  </label>
                  <input
                    type="text"
                    value={formData.ulica}
                    onChange={(e) => handleInputChange("ulica", e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                    placeholder="ul. Przykładowa 1/2"
                    autoComplete="street-address"
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
                    className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                    placeholder="38-400"
                    autoComplete="postal-code"
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
                    className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                    placeholder="Krosno"
                    autoComplete="address-level2"
                  />
                </div>
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

          {/* Zakres zabiegu PMU */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#4a4540] mb-6 pb-3 border-b border-[#d4cec4]">
              Zakres zabiegu
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                  Obszar zabiegu
                </label>
                <input
                  type="text"
                  value={formData.obszarZabiegu}
                  onChange={(e) =>
                    handleInputChange("obszarZabiegu", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                  placeholder="np. Brwi, Usta, Kreski"
                />
                <p className="text-xs text-[#8b8580] mt-2">
                  Ustalono, iż celem zabiegu jest makijaż permanentny w
                  powyższym obszarze.
                </p>
              </div>

              <div className="p-4 bg-white/50 rounded-xl">
                <label className="flex items-start gap-4 cursor-pointer">
                  <div className="w-5 h-5 mt-1 border border-[#8b7355] rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#8b7355] rounded-[1px]" />
                  </div>
                  <span className="text-sm text-[#5a5550]">
                    Przyjmuję do wiadomości, że efekt finalny jest indywidualny
                    i zależy od rodzaju skóry, ilości pigmentu i techniki. Ilość
                    zabiegów jest uwarunkowana indywidualnie.
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* Przeciwwskazania PMU */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#4a4540] mb-4 pb-3 border-b border-[#d4cec4]">
              Wywiad Medyczny
            </h3>
            <p className="text-sm text-[#6b6560] mb-6">
              Oświadczam, że NIE posiadam następujących przeciwwskazań:
            </p>

            <div className="space-y-3">
              {Object.entries(pmuContraindications).map(
                ([key, label], index) => (
                  <div
                    key={key}
                    className="flex items-start gap-4 p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors"
                  >
                    <span className="text-[#8b7355] font-medium min-w-[2rem]">
                      {index + 1}.
                    </span>
                    <p className="flex-1 text-[#5a5550] text-sm leading-relaxed">
                      {label}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleContraindicationChange(key, false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.przeciwwskazania[key] === false
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-white/80 text-[#6b6560] hover:bg-green-100"
                        }`}
                      >
                        NIE posiadam
                      </button>
                      <button
                        type="button"
                        onClick={() => handleContraindicationChange(key, true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.przeciwwskazania[key] === true
                            ? "bg-red-500 text-white shadow-md"
                            : "bg-white/80 text-[#6b6560] hover:bg-red-100"
                        }`}
                      >
                        POSIADAM
                      </button>
                      {/* W PMU oswiadczenie brzmi "Oświadczam, że NIE posiadam". Wiec negatywna odpowiedz jest dobra. */}
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Świadomość ryzyka PMU */}
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
                <div className="p-4 bg-white/50 rounded-xl">
                  <p className="text-sm font-medium text-[#4a4540] mb-2">
                    Naturalne reakcje:
                  </p>
                  <ul className="list-disc ml-5 text-sm text-[#5a5550]">
                    <li>swędzenie, strupki, złuszczanie</li>
                    <li>ciemniejszy kolor w pierwszych dniach</li>
                  </ul>
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      required
                      className="accent-[#8b7355]"
                    />
                    <span className="text-xs text-[#6b6560]">
                      Akceptuję możliwość wystąpienia powyższych reakcji.
                    </span>
                  </label>
                </div>

                <div className="p-4 bg-white/50 rounded-xl">
                  <p className="text-sm font-medium text-[#4a4540] mb-2">
                    Możliwe powikłania:
                  </p>
                  <ul className="list-disc ml-5 text-sm text-[#5a5550]">
                    <li>zakażenia (wirusowe/bakteryjne)</li>
                    <li>obrzęk, rumień</li>
                    <li>bliznowce, migracja pigmentu</li>
                  </ul>
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      required
                      className="accent-[#8b7355]"
                    />
                    <span className="text-xs text-[#6b6560]">
                      Zostałam/em poinformowana o ryzyku powikłań.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </section>

          {/* Zalecenia PMU */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("zalecenia")}
              className="w-full p-6 md:p-8 flex justify-between items-center text-left hover:bg-white/40 transition-colors"
            >
              <h3 className="text-2xl font-serif text-[#4a4540]">
                Zalecenia po zabiegu
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
                  Zobowiązuję się przestrzegać poniższych zaleceń:
                </p>
                <ul className="space-y-2 text-[#5a5550] text-sm">
                  <li>
                    • Wysoka higiena dłoni, nie myć mydłem miejsca zabiegu przez
                    2 tygodnie
                  </li>
                  <li>
                    • <strong>Unikać słońca i solarium przez 6 tygodni</strong>
                  </li>
                  <li>• Zakaz sauny/basenu przez min. 3 tygodnie</li>
                  <li>• Nie odrywać strupków</li>
                  <li>• Unikać gorących/ostrych potraw i alkoholu</li>
                  <li>
                    • Usta: pić przez słomkę, nie malować, higiena jamy ustnej
                  </li>
                  <li>• Zakaz botoksu/mezoterapii (2-3 tyg.)</li>
                  <li>• Zakaz peelingów (3 tyg.)</li>
                </ul>
                <p className="text-xs text-[#8b8580] mt-4">
                  Korekta możliwa do 2 miesięcy od zabiegu.
                </p>
                <label className="flex items-center gap-2 mt-4 pt-4 border-t border-[#d4cec4]">
                  <input
                    type="checkbox"
                    required
                    className="accent-[#8b7355]"
                  />
                  <span className="text-sm text-[#4a4540] font-medium">
                    Zobowiązuję się przestrzegać powyższych zaleceń.
                  </span>
                </label>
              </div>
            )}
          </section>

          {/* Oświadczenia i podpis */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#4a4540] mb-6 pb-3 border-b border-[#d4cec4]">
              Zgody i Oświadczenia
            </h3>

            <div className="space-y-4">
              <label className="flex items-start gap-4">
                <input
                  type="checkbox"
                  required
                  checked={formData.zgodaPrzetwarzanieDanych}
                  onChange={(e) =>
                    handleInputChange(
                      "zgodaPrzetwarzanieDanych",
                      e.target.checked,
                    )
                  }
                  className="accent-[#8b7355] mt-1"
                />
                <span className="text-sm text-[#5a5550]">
                  Świadomie i dobrowolnie poddaję się zabiegowi.
                </span>
              </label>

              <label className="flex items-start gap-4">
                <input
                  type="checkbox"
                  required
                  className="accent-[#8b7355] mt-1"
                />
                <span className="text-sm text-[#5a5550]">
                  Otrzymałam/em wyczerpujące informacje o zabiegu i pielęgnacji.
                </span>
              </label>

              <label className="flex items-start gap-4">
                <input
                  type="checkbox"
                  required
                  className="accent-[#8b7355] mt-1"
                />
                <span className="text-sm text-[#5a5550]">
                  Podane przeze mnie dane o stanie zdrowia są zgodne z prawdą.
                </span>
              </label>

              {formData.zgodaPrzetwarzanieDanych && (
                <div className="mt-4">
                  <SignaturePad
                    label="Podpis klienta"
                    value={formData.podpisDane}
                    onChange={(sig) => handleInputChange("podpisDane", sig)}
                    date={formData.miejscowoscData}
                    required
                  />
                </div>
              )}

              {/* Zgoda na wizerunek (opcja) */}
              <div className="p-4 bg-white/50 rounded-xl mt-4">
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
                    Opjonalnie: Wyrażam zgodę na publikację wizerunku w celach
                    promocji Royal Lips.
                  </span>
                </label>
                {formData.zgodaFotografie && (
                  <div className="mt-4 ml-9">
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
            </div>
            <div className="pt-6">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.zgodaPrzetwarzanieDanych ||
                  !formData.podpisDane
                }
                className="w-full bg-[#8b7355] text-white py-5 rounded-2xl text-lg font-medium tracking-wide hover:bg-[#7a6548] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting ? "Zapisywanie..." : "Zapisz Zgodę"}
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
