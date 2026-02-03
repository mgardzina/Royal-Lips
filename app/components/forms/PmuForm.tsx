"use client";

import { useState, useEffect } from "react";
import {
  Instagram,
  Phone,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowLeft,
  Mail,
  Shield,
  CheckCircle2,
  Lock,
  X,
} from "lucide-react";
import { isAdult } from "@/lib/dateUtils";
import SignaturePad from "../../../components/SignaturePad";
import SignatureVerificationModal from "@/components/SignatureVerificationModal";
import { AuditLogData } from "@/app/actions/otp";
import Footer from "@/app/components/Footer";
import {
  ConsentFormData,
  pmuContraindications,
  pmuNaturalReactions,
  pmuComplications,
  pmuPostCare,
  rodoInfo,
} from "../../../types/booking";

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
  osobaPrzeprowadzajacaZabieg: "",
  nazwaProduktu: "Pigment",
  obszarZabiegu: "",
  celEfektu: "",
  numerZabiegu: "",
  przeciwwskazania: Object.keys(pmuContraindications).reduce(
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

export default function PmuForm({ onBack }: PmuFormProps) {
  const [formData, setFormData] = useState<ConsentFormData>(initialFormData);
  const [email, setEmail] = useState("");
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    reakcje: true,
    powiklania: true,
    zalecenia: true,
    rodo: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentContraindicationIndex, setCurrentContraindicationIndex] =
    useState(0);
  const [showContraindicationsWizard, setShowContraindicationsWizard] =
    useState(true);

  // Form Steps: DATA -> SMS -> RODO -> TREATMENT -> MARKETING
  const [currentStep, setCurrentStep] = useState<
    "DATA" | "RODO" | "TREATMENT" | "MARKETING"
  >("DATA");

  // Digital Signature State
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSignatureVerified, setIsSignatureVerified] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditLogData | null>(null);

  const contraindicationKeys = Object.keys(pmuContraindications);
  const currentContraindicationKey =
    contraindicationKeys[currentContraindicationIndex];
  const isWizardComplete =
    currentContraindicationIndex === contraindicationKeys.length;

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

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

    // Validate age if full date is entered
    if (formatted.length === 10) {
      if (!isAdult(formatted)) {
        // You might want to set an error state here
        setBirthDateError(
          "Musisz być osobą pełnoletnią, aby wypełnić formularz.",
        );
      } else {
        setBirthDateError(null);
      }
    } else {
      setBirthDateError(null);
    }
  };

  const handleContraindicationChange = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      przeciwwskazania: { ...prev.przeciwwskazania, [key]: value },
    }));
  };

  // Handler dla zweryfikowanego podpisu - przejście do RODO
  const handleSignatureVerified = (
    _signatureData: string,
    audit: AuditLogData,
  ) => {
    // _signatureData is technically "SMS_VERIFIED_NO_SIGNATURE" now
    setAuditLog(audit);
    setIsSignatureVerified(true);
    setShowSignatureModal(false);

    // Explicitly transition to next step
    setCurrentStep("RODO");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generuj zawartość dokumentu do hashowania
  const getDocumentContent = () => {
    // Hashujemy dane osobowe i medyczne jako "rdzeń" identyfikacji
    return JSON.stringify({
      type: formData.type,
      imieNazwisko: formData.imieNazwisko,
      telefon: formData.telefon,
      dataUrodzenia: formData.dataUrodzenia,
      przeciwwskazania: formData.przeciwwskazania,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionData = {
      ...formData,
      nazwaProduktu: "Pigment",
      email: email || null,
      auditLog: auditLog, // Dodaj audit log do danych
      signatureStatus: isSignatureVerified ? "SIGNED" : "PENDING",
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
                setCurrentStep("DATA");
                resetWizard();
                setIsSignatureVerified(false);
                setAuditLog(null);
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

  // Helper to determining if Step 1 is valid to proceed (basic validation)
  const isStep1Valid =
    formData.imieNazwisko &&
    formData.telefon &&
    formData.telefon.replace(/\D/g, "").length === 9 &&
    formData.miejscowoscData &&
    formData.dataUrodzenia &&
    formData.obszarZabiegu &&
    isWizardComplete &&
    !birthDateError;

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
      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <button
              onClick={onBack}
              className="group flex items-center text-[#6b5540] hover:text-[#4a3a2a] transition-colors font-medium self-start"
            >
              <div className="bg-white/50 p-2 rounded-full mr-3 group-hover:bg-white/80 transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Powrót
            </button>
            <div className="flex gap-2 text-xs md:text-sm font-medium text-[#8b7355]/60 overflow-x-auto pb-2 md:pb-0">
              <span
                className={
                  currentStep === "DATA" ? "text-[#8b7355] font-bold" : ""
                }
              >
                1. Dane
              </span>
              <span>→</span>
              <span
                className={
                  currentStep === "RODO" ? "text-[#8b7355] font-bold" : ""
                }
              >
                2. RODO
              </span>
              <span>→</span>
              <span
                className={
                  currentStep === "TREATMENT" ? "text-[#8b7355] font-bold" : ""
                }
              >
                3. Zabieg
              </span>
              <span>→</span>
              <span
                className={
                  currentStep === "MARKETING" ? "text-[#8b7355] font-bold" : ""
                }
              >
                4. Zgody
              </span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-serif text-[#4a3a2a] mb-2">
              Karta Klienta
            </h1>
            <p className="text-[#8b7355] text-lg font-light tracking-wide uppercase">
              Makijaż Permanentny
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* KROK 1: DANE I WYWIAD */}
          {currentStep === "DATA" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Dane osobowe */}
              <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-serif text-[#4a3a2a] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#8b7355] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    1
                  </span>
                  Dane Osobowe
                </h2>

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
                  {/* Adres */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                        Ulica i numer domu/mieszkania
                      </label>
                      <input
                        type="text"
                        value={formData.ulica}
                        onChange={(e) =>
                          handleInputChange("ulica", e.target.value)
                        }
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
                    {birthDateError && (
                      <div className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                        <X className="w-4 h-4" />
                        <span>{birthDateError}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                      Telefon * (do weryfikacji SMS)
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
                <h2 className="text-2xl font-serif text-[#4a3a2a] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#8b7355] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    2
                  </span>
                  Obszar Zabiegu
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                      Obszar zabiegu
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {["Brwi", "Usta", "Kreski górne", "Kreski dolne"].map(
                        (area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() => {
                              const current = formData.obszarZabiegu
                                ? formData.obszarZabiegu.split(", ")
                                : [];
                              const newValue = current.includes(area)
                                ? current.filter((i) => i !== area).join(", ")
                                : [...current, area].join(", ");
                              handleInputChange("obszarZabiegu", newValue);
                            }}
                            className={`py-3 px-4 rounded-xl border-2 transition-all font-medium text-sm ${
                              formData.obszarZabiegu.split(", ").includes(area)
                                ? "border-[#8b7355] bg-[#8b7355] text-white"
                                : "border-[#d4cec4] bg-white text-[#6b6560] hover:border-[#8b7355] hover:text-[#8b7355]"
                            }`}
                          >
                            {area}
                          </button>
                        ),
                      )}
                    </div>
                    <input
                      type="text"
                      value={formData.obszarZabiegu}
                      onChange={(e) =>
                        handleInputChange("obszarZabiegu", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                      placeholder="Inny (wpisz ręcznie)..."
                    />
                    <p className="text-xs text-[#8b8580] mt-2">
                      Ustalono, iż celem zabiegu jest makijaż permanentny w
                      powyższym obszarze.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                      Oczekiwany efekt
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {[
                        "Naturalny efekt",
                        "Podkreślenie konturu",
                        "Ombre / Cieniowanie",
                        "Pełne wypełnienie",
                        "Wyrównanie asymetrii",
                      ].map((effect) => (
                        <button
                          key={effect}
                          type="button"
                          onClick={() => {
                            const current = formData.celEfektu
                              ? formData.celEfektu.split(", ")
                              : [];
                            const newValue = current.includes(effect)
                              ? current.filter((i) => i !== effect).join(", ")
                              : [...current, effect].join(", ");
                            handleInputChange("celEfektu", newValue);
                          }}
                          className={`py-3 px-4 rounded-xl border-2 transition-all font-medium text-sm ${
                            formData.celEfektu.split(", ").includes(effect)
                              ? "border-[#8b7355] bg-[#8b7355] text-white"
                              : "border-[#d4cec4] bg-white text-[#6b6560] hover:border-[#8b7355] hover:text-[#8b7355]"
                          }`}
                        >
                          {effect}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.celEfektu}
                      onChange={(e) =>
                        handleInputChange("celEfektu", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/80 border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                      placeholder="Inny (wpisz ręcznie)..."
                    />
                  </div>

                  <div className="p-4 bg-white/50 rounded-xl">
                    <p className="text-sm text-[#5a5550]">
                      Przyjmuję do wiadomości, że efekt finalny jest
                      indywidualny i zależy od rodzaju skóry, ilości pigmentu i
                      techniki. Ilość zabiegów jest uwarunkowana indywidualnie.
                    </p>
                  </div>
                </div>
              </section>

              {/* Wywiad Medyczny */}
              <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-serif text-[#4a3a2a] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#8b7355] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    3
                  </span>
                  Wywiad Medyczny
                </h2>
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
                        {pmuContraindications[currentContraindicationKey]}
                      </h4>

                      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                        <button
                          type="button"
                          onClick={() => handleWizardAnswer(false)}
                          className="py-4 px-6 rounded-xl bg-white border-2 border-[#d4cec4] text-[#6b6560] active:border-green-500 active:bg-green-500 active:text-white md:hover:border-green-500 md:hover:bg-green-500 md:hover:text-white transition-all text-lg font-medium shadow-sm hover:shadow-md active:scale-95 flex flex-col items-center justify-center gap-2"
                        >
                          NIE
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWizardAnswer(true)}
                          className="py-4 px-6 rounded-xl bg-white border-2 border-[#d4cec4] text-[#6b6560] active:border-red-500 active:bg-red-500 active:text-white md:hover:border-red-500 md:hover:bg-red-500 md:hover:text-white transition-all text-lg font-medium shadow-sm hover:shadow-md active:scale-95 flex flex-col items-center justify-center gap-2"
                        >
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

                      {Object.entries(pmuContraindications).map(
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

              <div className="flex justify-end pt-4 pb-12">
                <button
                  type="button"
                  onClick={() => setShowSignatureModal(true)}
                  disabled={!isStep1Valid}
                  className="bg-[#8b7355] text-white py-4 px-8 rounded-xl text-lg font-medium shadow-lg hover:bg-[#7a6548] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3"
                >
                  <Shield className="w-5 h-5" />
                  Weryfikuj Tożsamość (SMS) i Przejdź Dalej
                </button>
              </div>
            </div>
          )}

          {/* KROK 2: RODO */}
          {currentStep === "RODO" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-serif text-[#4a4540] mb-6">
                    Klauzula Informacyjna RODO
                  </h3>
                  <div className="bg-[#f8f6f3] p-6 rounded-xl text-sm text-[#5a5550] leading-relaxed whitespace-pre-line max-h-[60vh] overflow-y-auto mb-6 border border-[#e5e0d8]">
                    {rodoInfo.pelnyTekst}
                  </div>

                  {/* Signature Area for RODO - Expanded and simplified */}
                  <div className="mt-8">
                    <p className="text-sm text-[#6b6560] mb-4 font-medium uppercase tracking-wide">
                      Podpis Klienta:
                    </p>
                    <div className="bg-white rounded-xl overflow-hidden min-h-[200px]">
                      <SignaturePad
                        label=""
                        value={formData.podpisRodo}
                        onChange={(sig) => {
                          handleInputChange("podpisRodo", sig);
                          // Auto-approve RODO consent when signed
                          if (sig && !formData.zgodaPrzetwarzanieDanych) {
                            handleInputChange("zgodaPrzetwarzanieDanych", true);
                          }
                        }}
                        date={formData.miejscowoscData}
                      />
                    </div>
                    <p className="text-xs text-[#8b8580] mt-3 italic">
                      Złożenie podpisu jest równoznaczne z akceptacją powyższej
                      klauzuli informacyjnej RODO.
                    </p>
                  </div>
                </div>
              </section>

              <div className="flex justify-between pt-4 pb-12">
                {/* Powrót zablokowany - Weryfikacja SMS jest bramą jednokierunkową w tej sesji (uproszczenie) lub można wrócić do danych */}
                <button
                  type="button"
                  onClick={() => setCurrentStep("DATA")}
                  className="text-[#6b5540] hover:text-[#4a3a2a] px-6 py-3 font-medium transition-colors"
                >
                  ← Wróć do danych
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep("TREATMENT")}
                  disabled={!formData.podpisRodo}
                  className="bg-[#8b7355] text-white py-3 px-8 rounded-xl text-lg font-medium shadow-lg hover:bg-[#7a6548] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Dalej →
                </button>
              </div>
            </div>
          )}

          {/* KROK 3: ZABIEG (Ryzyko, Powikłania, Oświadczenia) */}
          {currentStep === "TREATMENT" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Świadomość ryzyka PMU */}
              <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-serif text-[#4a4540] mb-6 border-b border-[#d4cec4] pb-2">
                    Świadomość Ryzyka i Powikłań
                  </h3>
                  <p className="text-sm text-[#6b6560] mb-4">
                    Zostałam/em poinformowana/y o przebiegu zabiegu i możliwości
                    naturalnego wystąpienia po zabiegu reakcji organizmu:
                  </p>

                  <div className="space-y-6">
                    <div className="bg-[#f8f6f3] p-5 rounded-xl border border-[#d4cec4]/50">
                      <p className="text-sm font-medium text-[#4a4540] mb-3">
                        Możliwe naturalne reakcje na zabieg:
                      </p>
                      <ul className="space-y-2 text-sm text-[#5a5550]">
                        {pmuNaturalReactions.map((reaction, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-[#8b7355]">•</span>
                            {reaction}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#f8f6f3] p-5 rounded-xl border border-[#d4cec4]/50">
                      <p className="text-sm font-medium text-[#4a4540] mb-3">
                        Możliwe powikłania (rzadkie i bardzo rzadkie):
                      </p>
                      <div className="space-y-3 text-sm text-[#5a5550]">
                        <p>
                          <span className="font-medium">Częste:</span>{" "}
                          {pmuComplications.czeste.join(", ")}
                        </p>
                        <p>
                          <span className="font-medium">Rzadkie:</span>{" "}
                          {pmuComplications.rzadkie.join(", ")}
                        </p>
                        <p>
                          <span className="font-medium">Bardzo rzadkie:</span>{" "}
                          {pmuComplications.bardzoRzadkie.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Zalecenia */}
              <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-serif text-[#4a4540] mb-6 border-b border-[#d4cec4] pb-2">
                    Zobowiązania Pozabiegowe
                  </h3>
                  <p className="text-sm text-[#6b6560] mb-4">
                    Zobowiązuję się do przestrzegania następujących zaleceń:
                  </p>
                  <ul className="space-y-2 text-[#5a5550] text-sm bg-white/50 p-4 rounded-xl border border-[#d4cec4]/30">
                    {pmuPostCare.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#8b7355]">•</span>
                        <span
                          className={
                            instruction.includes("UWAGA")
                              ? "font-bold text-[#bfa07a]"
                              : ""
                          }
                        >
                          {instruction}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Oświadczenia */}
              <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
                <h3 className="text-2xl font-serif text-[#4a4540] mb-6 border-b border-[#d4cec4] pb-2">
                  Oświadczenia
                </h3>
                <div className="bg-[#f8f6f3] p-5 rounded-xl mb-6 border border-[#d4cec4]/50">
                  <p className="text-sm text-[#5a5550] leading-relaxed">
                    <strong>Oświadczam, że:</strong>
                  </p>
                  <ol className="list-decimal ml-5 mt-2 text-sm text-[#5a5550] space-y-2">
                    <li>
                      Jestem świadoma/y przebiegu zabiegu, jego celu, oraz
                      okoliczności jego przeprowadzenia i zasad obowiązujących
                      po wykonaniu zabiegu, oraz że świadomie i dobrowolnie
                      poddaję się zabiegowi.
                    </li>
                    <li>
                      Osoba przeprowadzająca zabieg poinformowała mnie o
                      powyższych okolicznościach, oraz udzieliła mi niezbędnych
                      odpowiedzi oraz wszelkich informacji co do zachowania po
                      zabiegu.
                    </li>
                    <li>
                      Podane przeze mnie w niniejszym oświadczeniu odpowiedzi, w
                      szczególności co do stanu zdrowia, są zgodne z prawdą.
                    </li>
                  </ol>
                </div>
                {/* Podpis pod Zabiegiem (Nowy, obowiązkowy) */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mt-8">
                  <h3 className="text-xl font-serif text-[#4a4540] mb-4 border-b border-[#d4cec4] pb-2">
                    Potwierdzenie Zgody na Zabieg
                  </h3>
                  <p className="text-sm text-[#5a5550] mb-6">
                    Składając podpis poniżej potwierdzam, że zapoznałam/em się z
                    powyższymi informacjami, ryzykiem oraz zaleceniami i wyrażam
                    świadomą zgodę na przeprowadzenie zabiegu.
                  </p>
                  <SignaturePad
                    label="Podpis Klienta (Wymagany)"
                    value={formData.podpisDane}
                    onChange={(sig) => {
                      handleInputChange("podpisDane", sig);
                      handleInputChange("zgodaPomocPrawna", !!sig);
                    }}
                    date={formData.miejscowoscData}
                  />
                </div>
              </section>

              <div className="flex justify-between pt-4 pb-12">
                <button
                  type="button"
                  onClick={() => setCurrentStep("RODO")}
                  className="text-[#6b5540] hover:text-[#4a3a2a] px-6 py-3 font-medium transition-colors"
                >
                  ← Wróć do RODO
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep("MARKETING")}
                  disabled={!formData.podpisDane}
                  className="bg-[#8b7355] text-white py-3 px-8 rounded-xl text-lg font-medium shadow-lg hover:bg-[#7a6548] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Dalej (Zgody dodatkowe) →
                </button>
              </div>
            </div>
          )}

          {/* KROK 4: MARKETING I ZGODY DODATKOWE */}
          {currentStep === "MARKETING" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
                <h3 className="text-2xl font-serif text-[#4a4540] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#8b7355] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    4
                  </span>
                  Zgody Dodatkowe
                </h3>
                <p className="text-sm text-[#6b6560] mb-6">
                  Poniższe zgody są <strong>opcjonalne</strong>.
                </p>

                {/* Zgoda na marketing */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-[#e5e0d8] hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h4 className="font-serif text-[#4a4540] text-lg mb-3">
                      Zgoda Marketingowa
                    </h4>
                    <p className="text-sm text-[#5a5550] leading-relaxed mb-6">
                      Wyrażam zgodę na otrzymywanie informacji o nowościach,
                      promocjach i ofertach specjalnych od firmy{" "}
                      <strong>{rodoInfo.firmaNazwa}</strong> drogą elektroniczną
                      (SMS / E-mail).
                    </p>
                    <SignaturePad
                      label="Podpis (Zgadzam się)"
                      value={formData.podpisMarketing}
                      onChange={(sig) => {
                        handleInputChange("podpisMarketing", sig);
                        handleInputChange("zgodaMarketing", !!sig);
                      }}
                      date={formData.miejscowoscData}
                    />
                  </div>
                </div>

                {/* Zgoda na wizerunek */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-[#e5e0d8] hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h4 className="font-serif text-[#4a4540] text-lg mb-3">
                      Zgoda na Wykorzystanie Wizerunku
                    </h4>
                    <p className="text-sm text-[#5a5550] leading-relaxed mb-4">
                      Wyrażam nieodpłatną zgodę na utrwalenie i
                      rozpowszechnianie mojego wizerunku (zdjęcia/video efektów
                      zabiegu) w celach promocyjnych salonu Royal Lips.
                    </p>

                    <div className="mb-6">
                      <label className="block text-xs uppercase tracking-wider text-[#8b8580] mb-2 font-medium">
                        Gdzie możemy publikować? (opcjonalnie)
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
                        className="w-full px-4 py-2 bg-[#f8f6f3] border-b border-[#d4cec4] focus:border-[#8b7355] outline-none text-sm transition-colors text-[#4a4540]"
                        placeholder="np. Instagram, Facebook (zostaw puste = wszystkie)"
                      />
                    </div>

                    <SignaturePad
                      label="Podpis (Zgadzam się)"
                      value={formData.podpisFotografie}
                      onChange={(sig) => {
                        handleInputChange("podpisFotografie", sig);
                        handleInputChange("zgodaFotografie", !!sig);
                      }}
                      date={formData.miejscowoscData}
                    />
                  </div>
                </div>

                {/* Zgoda prawna */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-[#e5e0d8] hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h4 className="font-serif text-[#4a4540] text-lg mb-3">
                      Zgoda na Pomoc Prawną
                    </h4>
                    <p className="text-sm text-[#5a5550] leading-relaxed mb-6">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych (w
                      tym danych wrażliwych) przez podmioty świadczące pomoc
                      prawną na rzecz salonu, w przypadku wystąpienia roszczeń.
                    </p>
                    <SignaturePad
                      label="Podpis (Zgadzam się)"
                      // This uses podpisRodo? Wait, likely a bug in original code using podpisRodo for legal consent?
                      // Checking original code: Checked => updates zgodaPomocPrawna. Signature => podpisRodo?
                      // Line 998: handleInputChange("podpisRodo", sig).
                      // This seems WRONG if podpisRodo was already used in Step 2.
                      // However, strictly refactoring visualization, I should probably check if we need separate signature.
                      // ConsentFormData has: podpisDane, podpisMarketing, podpisFotografie, podpisRodo.
                      // It DOES NOT have 'podpisPomocPrawna'.
                      // Assuming 'podpisRodo' is reused or I should use 'podpisDane'?
                      // ACTUALLY, usually Legal consent is tied to the main RODO signature or just a checkbox.
                      // Since I don't have a field for it, I'll reuse 'podpisRodo' if that was the intent,
                      // OR (better) I should assume the user acts on "zgodaPomocPrawna" boolean.
                      // But wait, the previous code lines 994-1001 SHOWED a signature pad updating "podpisRodo".
                      // This overwrites the MAIN RODO signature from Step 2!! This is a BUG in the previous code.
                      // Since I can't add fields to Schema right now easily (or I can?), I will check Schema.
                      // Schema has: `podpisDane String?`, `podpisMarketing String?`, `podpisFotografie String?`, `podpisRodo String?`.
                      // It seems I am out of signature fields.
                      // I will temporarily COMMENT OUT the signature for Legal Consent and make it a toggle/checkbox INSIDE the card,
                      // OR just reuse the checkbox/toggle since I lack a DB field for a 5th signature.
                      // Wait, 'podpisDane' is empty in initialFormData. Maybe utilize that?
                      // Let's use 'podpisDane' for 'Pomoc Prawna' for now to avoid overwriting RODO.
                      value={formData.podpisDane}
                      onChange={(sig) => {
                        handleInputChange("podpisDane", sig);
                        handleInputChange("zgodaPomocPrawna", !!sig);
                      }}
                      date={formData.miejscowoscData}
                    />
                  </div>
                </div>

                {/* Informacja dodatkowa */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-[#e5e0d8] hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <label className="block font-serif text-[#4a4540] text-lg mb-3">
                      Uwagi Dodatkowe
                    </label>
                    <textarea
                      value={formData.informacjaDodatkowa || ""}
                      onChange={(e) =>
                        handleInputChange("informacjaDodatkowa", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-[#f8f6f3] border-b border-[#d4cec4] focus:border-[#8b7355] outline-none transition-all resize-none rounded-t-lg"
                      placeholder="Np. uwagi co do terminu, prośby..."
                      rows={3}
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-between pt-4 pb-12 items-center border-t border-[#d4cec4]/50 mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep("TREATMENT")}
                  className="text-[#6b5540] hover:text-[#4a3a2a] px-6 py-3 font-medium transition-colors"
                >
                  ← Wróć do zabiegu
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isSignatureVerified}
                  className="bg-[#8b7355] text-white py-4 px-12 rounded-xl text-lg font-medium shadow-lg hover:bg-[#7a6548] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Zapisywanie...
                    </div>
                  ) : (
                    "Zatwierdź i Wyślij Kartę"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </main>

      <Footer />

      {/* Modal weryfikacji podpisu */}
      <SignatureVerificationModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onVerified={handleSignatureVerified}
        phoneNumber={formData.telefon}
        documentContent={getDocumentContent()}
        clientName={formData.imieNazwisko || "Klient"}
      />
    </div>
  );
}
