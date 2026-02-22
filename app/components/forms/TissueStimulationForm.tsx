import { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Check, ArrowLeft, Instagram, Mail, Shield } from "lucide-react";
import {
  getTodayDate,
  formatBirthDate,
  validateBirthDate,
} from "@/lib/dateUtils";
import SignaturePad from "@/components/SignaturePad";
import SignatureVerificationModal from "@/components/SignatureVerificationModal";
import { AuditLogData } from "@/app/actions/otp";
import Footer from "@/app/components/Footer";
import AnatomyFaceSelector from "../AnatomyFaceSelector";
import { ZONES as TISSUE_ZONES } from "@/types/face-zones-tissue";
import BackButton from "../BackButton";
import { SALON_CONFIG } from "@/app/config/salon";
import {
  ConsentFormData,
  ContraindicationWithFollowUp,
  biostymulatoryContraindications,
  biostymulatorySideEffects,
  biostymulatoryComplications,
  biostymulatoryPreTreatment,
  biostymulatoryPostTreatment,
  rodoInfo,
} from "../../../types/booking";

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  "EJAL 40":
    "Bio-rewitalizujący żel z kwasem hialuronowym. Przywraca fizjologiczne funkcje skóry, poprawia jej gęstość i elastyczność.",
  PROFHILO:
    "„Molekuła Młodości” z najwyższym stężeniem kwasu hialuronowego. Działa jako stymulator tkankowy do remodelingu skóry.",
  NUCLEOFIL:
    "Preparat na bazie polinukleotydów. Zapewnia głębokie nawilżenie, działanie antyoksydacyjne i stymulację produkcji kolagenu.",
  "PINK GLOW":
    "Zaawansowany koktajl z 55 składnikami aktywnymi. Rozjaśnia przebarwienia, rozświetla skórę i głęboko ją odżywia.",
  "LUMI EYES":
    "Stymulator dedykowany okolicy oka. Regeneruje tkanki, redukuje cienie pod oczami i wygładza drobne zmarszczki.",
  "SUNEKOS 200":
    "Połączenie kwasu hialuronowego i aminokwasów. Stymuluje produkcję kolagenu i elastyny, odmładzając skórę okolicy oka.",
};

interface TissueStimulationFormProps {
  onBack: () => void;
}

const initialFormData: ConsentFormData = {
  type: "TISSUE_STIMULATION",
  imieNazwisko: "",
  ulica: "",
  kodPocztowy: "",
  miasto: SALON_CONFIG.city,
  dataUrodzenia: "",
  telefon: "",
  miejscowoscData: `${SALON_CONFIG.city}, ${getTodayDate()}`,
  osobaPrzeprowadzajacaZabieg: "",
  nazwaProduktu: "",
  obszarZabiegu: "",
  celEfektu: "",
  numerZabiegu: "",
  przeciwwskazania: Object.entries(biostymulatoryContraindications).reduce(
    (acc, [key, value]) => {
      const hasFollowUp = typeof value === "object" && value.hasFollowUp;
      return {
        ...acc,
        [key]: null,
        ...(hasFollowUp ? { [`${key}_details`]: "" } : {}),
      };
    },
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
  podpisRodo2: "",
  informacjaDodatkowa: "",
  zastrzeniaKlienta: "",
};

export default function TissueStimulationForm({
  onBack,
}: TissueStimulationFormProps) {
  const [formData, setFormData] = useState<ConsentFormData>(initialFormData);
  const [email, setEmail] = useState("");
  const [birthDateError, setBirthDateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentContraindicationIndex, setCurrentContraindicationIndex] =
    useState(0);
  const [showContraindicationsWizard, setShowContraindicationsWizard] =
    useState(true);
  const [isWizardComplete, setIsWizardComplete] = useState(false);

  // Form Steps: DATA -> SMS -> RODO -> TREATMENT -> MARKETING
  type Step = "DATA" | "RODO" | "RODO2" | "TREATMENT" | "MARKETING";
  const [currentStep, setCurrentStep] = useState<Step>("DATA");

  // Digital Signature State
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSignatureVerified, setIsSignatureVerified] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditLogData | null>(null);

  const contraindicationKeys = Object.keys(biostymulatoryContraindications);
  const currentContraindicationKey =
    contraindicationKeys[currentContraindicationIndex];
  const currentContraindicationValue =
    biostymulatoryContraindications[currentContraindicationKey];
  const currentContraindicationObject:
    | ContraindicationWithFollowUp
    | undefined =
    typeof currentContraindicationValue === "string"
      ? undefined
      : currentContraindicationValue;

  // Calculate next potential question index (skipping completed wizard steps)
  const getNextIncompleteIndex = () => {
    // If wizard not started or just starting
    if (currentContraindicationIndex === -1) return 0;

    // Check from current index onwards
    for (
      let i = currentContraindicationIndex;
      i < contraindicationKeys.length;
      i++
    ) {
      const key = contraindicationKeys[i];
      // If this key hasn't been answered yet (is null or undefined)
      if (
        formData.przeciwwskazania[key] === undefined ||
        formData.przeciwwskazania[key] === null
      ) {
        return i;
      }
    }
    return -1; // All done
  };

  // Update wizard completion status
  // REMOVED: Auto-completion effect caused premature closing on last question follow-up
  // useEffect(() => {
  //   const isComplete = contraindicationKeys.every(
  //     (key) =>
  //       formData.przeciwwskazania[key] !== undefined &&
  //       formData.przeciwwskazania[key] !== null,
  //   );
  //   setIsWizardComplete(isComplete);
  // }, [formData.przeciwwskazania, contraindicationKeys]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const handleWizardAnswer = (value: boolean) => {
    handleContraindicationChange(currentContraindicationKey, value);

    // If answer is YES and has follow-up, stay on step to allow input
    const hasFollowUp =
      typeof currentContraindicationObject === "object" &&
      currentContraindicationObject?.hasFollowUp;

    if (value === true && hasFollowUp) {
      return;
    }

    if (currentContraindicationIndex < contraindicationKeys.length - 1) {
      setCurrentContraindicationIndex((prev) => prev + 1);
    } else {
      setIsWizardComplete(true);
    }
  };

  const handleNextStep = () => {
    if (currentContraindicationIndex < contraindicationKeys.length - 1) {
      setCurrentContraindicationIndex((prev) => prev + 1);
    } else {
      setIsWizardComplete(true);
    }
  };

  const resetWizard = () => {
    // Clear all contraindication answers
    setFormData((prev) => ({
      ...prev,
      przeciwwskazania: {},
    }));
    setCurrentContraindicationIndex(0);
    setShowContraindicationsWizard(true);
    setIsWizardComplete(false);
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

  const handleBirthDateChange = (value: string) => {
    const formatted = formatBirthDate(value);
    setFormData((prev) => ({ ...prev, dataUrodzenia: formatted }));
    if (formatted.length === 10) {
      setBirthDateError(validateBirthDate(formatted));
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

  // Handler dla zweryfikowanego podpisu
  // Handler dla zweryfikowanego podpisu
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
        <div className="bg-white backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-lg text-center">
          <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-serif text-[#4a4540] mb-4">
            Dziękujemy!
          </h2>
          <p className="text-[#4a4540] mb-8">Twój formularz został zapisany.</p>
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
              className="bg-[#4a4540] text-white px-8 py-3 rounded-xl hover:bg-[#2C2622] transition-colors"
            >
              Wypełnij ponownie
            </button>
            <BackButton
              onClick={onBack}
              label="Wróć do wyboru zabiegu"
              className="w-full justify-center"
            />
          </div>
        </div>
      </div>
    );
  }

  // Basic validation for Step 1
  const isStep1Valid =
    formData.imieNazwisko &&
    formData.telefon &&
    formData.telefon.replace(/\D/g, "").length === 9 &&
    formData.miejscowoscData &&
    formData.dataUrodzenia &&
    !birthDateError &&
    isWizardComplete;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5] text-[#4a4540]">
      {/* Header */}
      <header className="bg-[#4a4540] sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-serif text-[#d4cec4] tracking-wider">
            ROYAL LIPS
          </h1>
          <div className="flex items-center gap-4">
            <a
              href="tel:+48792377737"
              className="text-[#d4cec4] hover:text-white transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/makijazpermanentnykrosno/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4cec4] hover:text-white transition-colors"
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
            <BackButton onClick={onBack} className="self-start" />
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
                  currentStep === "RODO2" ? "text-[#8b7355] font-bold" : ""
                }
              >
                3. RODO 2
              </span>
              <span>→</span>
              <span
                className={
                  currentStep === "TREATMENT" ? "text-[#8b7355] font-bold" : ""
                }
              >
                4. Zabieg
              </span>
              <span>→</span>
              <span
                className={
                  currentStep === "MARKETING" ? "text-[#8b7355] font-bold" : ""
                }
              >
                5. Zgody
              </span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-serif text-[#4a4540] mb-2">
              Stymulacja tkankowa
            </h1>
            <p className="text-[#C4B5A0] text-lg font-light tracking-wide uppercase">
              Biostymulatory
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* KROK 1: DANE I WYWIAD */}
          {currentStep === "DATA" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Dane osobowe */}
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-[#8b7355]/40">
                <h2 className="text-2xl font-serif text-[#4a4540] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#4a4540] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    1
                  </span>
                  Dane Osobowe
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#4a4540] mb-2 font-medium">
                      Imię i nazwisko *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.imieNazwisko}
                      onChange={(e) =>
                        handleInputChange("imieNazwisko", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#C4B5A0] focus:ring-2 focus:ring-[#C4B5A0]/20 text-[#4a4540] placeholder-[#8b7355]/40 outline-none transition-all"
                      placeholder="Imię i Nazwisko"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#4a4540] mb-2 font-medium">
                      Miejscowość / Data *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.miejscowoscData}
                      onChange={(e) =>
                        handleInputChange("miejscowoscData", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#C4B5A0] focus:ring-2 focus:ring-[#C4B5A0]/20 text-[#4a4540] placeholder-[#8b7355]/40 outline-none transition-all"
                      placeholder={`${SALON_CONFIG.city}, 27.01.2026`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#4a4540] mb-2 font-medium">
                      Adres E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a4540]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#C4B5A0] focus:ring-2 focus:ring-[#C4B5A0]/20 text-[#4a4540] placeholder-[#8b7355]/40 outline-none transition-all"
                        placeholder={SALON_CONFIG.email}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-[#4a4540] mb-2 font-medium">
                        Ulica i numer
                      </label>
                      <input
                        type="text"
                        value={formData.ulica}
                        onChange={(e) =>
                          handleInputChange("ulica", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#C4B5A0] focus:ring-2 focus:ring-[#C4B5A0]/20 text-[#4a4540] placeholder-[#8b7355]/40 outline-none transition-all"
                        placeholder="ul. Przykładowa 1/2"
                        autoComplete="street-address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#4a4540] mb-2 font-medium">
                        Kod pocztowy
                      </label>
                      <input
                        type="text"
                        value={formData.kodPocztowy}
                        onChange={(e) =>
                          handleInputChange("kodPocztowy", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#C4B5A0] focus:ring-2 focus:ring-[#C4B5A0]/20 text-[#4a4540] placeholder-[#8b7355]/40 outline-none transition-all"
                        placeholder="38-400"
                        autoComplete="postal-code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#4a4540] mb-2 font-medium">
                        Miasto
                      </label>
                      <input
                        type="text"
                        value={formData.miasto}
                        onChange={(e) =>
                          handleInputChange("miasto", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#C4B5A0] focus:ring-2 focus:ring-[#C4B5A0]/20 text-[#4a4540] placeholder-[#8b7355]/40 outline-none transition-all"
                        placeholder={SALON_CONFIG.city}
                        autoComplete="address-level2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#4a4540] mb-2 font-medium">
                      Data urodzenia * (min. 16 lat)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={formData.dataUrodzenia}
                      onChange={(e) => handleBirthDateChange(e.target.value)}
                      placeholder="DD.MM.RRRR"
                      maxLength={10}
                      className={`w-full px-4 py-3 bg-white border rounded-xl focus:border-[#C4B5A0] focus:ring-2 focus:ring-[#C4B5A0]/20 text-[#4a4540] placeholder-[#8b7355]/40 outline-none transition-all ${
                        birthDateError ? "border-red-500" : "border-[#d4cec4]"
                      }`}
                    />
                    {birthDateError && (
                      <div className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                        <span>{birthDateError}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-[#4a4540] mb-2 font-medium">
                      Telefon * (do weryfikacji SMS)
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 py-3 bg-[#f0ebe4] border border-r-0 border-[#d4cec4] rounded-l-xl text-[#4a4540] font-medium select-none">
                        +48
                      </span>
                      <input
                        type="tel"
                        required
                        value={formData.telefon}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#d4cec4] rounded-r-xl focus:border-[#C4B5A0] focus:ring-2 focus:ring-[#C4B5A0]/20 text-[#4a4540] placeholder-[#8b7355]/40 outline-none transition-all"
                        placeholder="123 456 789"
                        maxLength={11}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Informacja o Zabiegu */}
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-[#8b7355]/40">
                <h2 className="text-2xl font-serif text-[#4a4540] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#4a4540] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    2
                  </span>
                  Informacja o Zabiegu
                </h2>
                <div className="bg-[#f8f6f3] p-6 rounded-xl border border-[#d4cec4] text-[#4a4540] leading-relaxed space-y-4">
                  <p>
                    Stymulatory tkankowe są wykorzystywane w medycynie
                    przeciwstarzeniowej i służą do odbudowy struktury skóry,
                    dzięki stymulacji komórek skóry: kolagenu i elastyny.
                    Zazwyczaj są to preparaty na bazie nieusieciowanego kwasu
                    hialuronowego o różnych stężeniach i kwasu bursztynowego,
                    który ma zdolności do bioregeneracji. Kwas hialuronowy
                    natomiast ma zdolności wypełniające oraz nawilżające.
                  </p>
                  <p>
                    Zabieg stymulatorami tkankowymi jest wykonywany przy użyciu
                    produktów takich jak:
                  </p>
                  <p>
                    Każdorazowo preparat, który zostanie użyty podczas zabiegu
                    jest dobierany przez Specjalistę, według oczekiwań i potrzeb
                    Klienta. Proponowany zabieg jest zabiegiem inwazyjny gdyż
                    związany jest z przerwaniem ciągłości naskórka, wobec czego
                    nie jest pozbawiony ryzyka.
                  </p>
                  <p>
                    Zabieg polega na wstrzyknięciu za pomocą igły lub kaniuli
                    ww. preparatu w miejsca poddane zabiegowi. Celem zabiegu
                    jest zneutralizowanie zwiotczenia skóry, przywrócenia
                    utraconego konturu twarzy, wygładzenia zmarszczek,
                    wysmuklenia rys twarzy, wygładzenia oraz zagęszczenia skóry,
                    a także poprawa walorów estetycznych i samopoczucia klienta.
                    Wskazaniem do przeprowadzenia zabiegu za pomocą stymulatorów
                    tkankowych jest modelowanie policzków, wypełnienie linii
                    marionetki, korekta linii żuchwy i okolicy podjarzmowej, a
                    także korekta kształtu nosa i brody.
                  </p>
                  <p>
                    Ponadto celem zabiegu jest przywrócenie jędrności skóry,
                    zatrzymanie oznak starzenia, zniwelowanie pierwszych
                    zmarszczek, zrewitalizowanie suchej skóry – pozbawionej
                    blasku.
                  </p>

                  <p>
                    Zabieg odbywa się zawsze po wykluczeniu wszelkich
                    przeciwwskazań do wykonania zabiegu. W rozmowie z Klientem
                    zostają określone potrzeby i oczekiwania od wykonania
                    zabiegu.
                  </p>

                  <p>
                    Kolejnym etapem jest znieczulenie, które minimalizuje
                    dyskomfort podczas zabiegu. Próg bólu odczuwany jest
                    indywidualnie.
                  </p>

                  <p>
                    Zastosowanie znieczulenia gwarantuje zminimalizowanie bólu,
                    który w większości przypadków określany jest, jako niemal
                    nie odczuwalny. Czas zabiegu zależny jest od miejsca
                    aplikacji oraz cech indywidualnych naskórka, ale średnio
                    trwa ok. godzinę.
                  </p>
                  <p>
                    Zabieg przy użyciu stymulatorów tkankowych nie daje efektów
                    trwałych, jego efekt utrzymuje się przez okres około 6
                    miesięcy i należy go powtórzyć po tym czasie . Efekt zabiegu
                    utrzymuje się w zależności od rodzaju skóry, wstrzykniętej
                    ilości preparatu, oraz techniki iniekcji, ale także od
                    jakości życia. Specjalista informuje Klienta o tym, że
                    efekty zabiegu nie są identyczne w przypadku każdego
                    Klienta.
                  </p>
                </div>
              </section>

              {/* Sekcja 3: Obszar Zabiegu */}
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-[#8b7355]/40">
                <h2 className="text-2xl font-serif text-[#4a4540] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#4a4540] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    3
                  </span>
                  Obszar Zabiegu
                </h2>
                <div className="mb-8">
                  <label className="block text-sm text-[#4a4540] mb-2 font-medium">
                    Obszar Zabiegu
                  </label>
                  <div className="bg-[#f8f6f3] p-4 rounded-xl border border-[#d4cec4]">
                    <p className="text-xs text-[#4a4540] mb-4 text-center">
                      Zaznacz na schemacie obszary, które mają zostać poddane
                      zabiegowi.
                    </p>
                    <AnatomyFaceSelector
                      customZones={TISSUE_ZONES}
                      initialSelected={
                        formData.obszarZabiegu
                          ? formData.obszarZabiegu.split(", ").filter(Boolean)
                          : []
                      }
                      onSelect={(selectedIds) => {
                        handleInputChange(
                          "obszarZabiegu",
                          selectedIds.join(", "),
                        );
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* Wywiad Medyczny Hyaluronic */}
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-[#8b7355]/40">
                <h2 className="text-2xl font-serif text-[#4a4540] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#4a4540] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    4
                  </span>
                  Wywiad Medyczny
                </h2>
                <p className="text-sm text-[#4a4540] mb-6">
                  Czy posiadasz którekolwiek z poniższych przeciwwskazań?
                </p>

                {/* Medications Input */}
                <div className="bg-[#f8f6f3] p-5 rounded-xl border border-[#d4cec4] mb-6">
                  <h3 className="font-serif text-[#4a4540] text-lg mb-2">
                    PRZECIWWSKAZANIA DO WYKONANIA ZABIEGU
                  </h3>
                  <label className="block text-sm text-[#4a4540] mb-2 font-medium">
                    Proszę wpisać wykaz wszystkich leków przyjmowanych w ciągu
                    ostatnich 6 miesięcy
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#C4B5A0] outline-none text-sm text-[#4a4540] placeholder-[#8b7355]/40"
                    placeholder="Wpisz leki lub wpisz 'BRAK'..."
                    value={
                      (formData.informacjaDodatkowa || "")
                        .split("\n")
                        .find((p) => p.startsWith("Leki (6 m-cy): "))
                        ?.replace("Leki (6 m-cy): ", "") || ""
                    }
                    onChange={(e) => {
                      const parts = (formData.informacjaDodatkowa || "").split(
                        "\n",
                      );
                      const prefix = "Leki (6 m-cy): ";
                      const newVal = `${prefix}${e.target.value}`;
                      const index = parts.findIndex((p) =>
                        p.startsWith(prefix),
                      );

                      if (index !== -1) {
                        if (e.target.value) {
                          parts[index] = newVal;
                        } else {
                          parts.splice(index, 1);
                        }
                      } else if (e.target.value) {
                        parts.push(newVal);
                      }

                      handleInputChange(
                        "informacjaDodatkowa",
                        parts.filter(Boolean).join("\n"),
                      );
                    }}
                  />
                </div>

                <div className="space-y-3">
                  {showContraindicationsWizard &&
                  !isWizardComplete &&
                  currentContraindicationIndex < contraindicationKeys.length ? (
                    <div
                      key={currentContraindicationIndex}
                      className="bg-[#f8f6f3] p-6 rounded-xl border border-[#d4cec4] max-w-2xl mx-auto shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-medium text-[#C4B5A0]">
                          Pytanie {currentContraindicationIndex + 1} z{" "}
                          {contraindicationKeys.length}
                        </span>
                        <div className="h-2 w-24 bg-[#d4cec4] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#4a4540] transition-all duration-300"
                            style={{
                              width: `${((currentContraindicationIndex + 1) / contraindicationKeys.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <h4 className="text-xl md:text-2xl font-serif text-[#4a4540] mb-8 min-h-[5rem] flex items-center justify-center text-center">
                        {typeof biostymulatoryContraindications[
                          currentContraindicationKey
                        ] === "string"
                          ? (biostymulatoryContraindications[
                              currentContraindicationKey
                            ] as string)
                          : (
                              biostymulatoryContraindications[
                                currentContraindicationKey
                              ] as ContraindicationWithFollowUp
                            ).text}
                      </h4>

                      {/* Show follow-up input if user answered TAK and question has follow-up */}
                      {formData.przeciwwskazania[currentContraindicationKey] ===
                        true &&
                        currentContraindicationObject?.hasFollowUp && (
                          <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                            <input
                              type="text"
                              className="w-full px-4 py-3 text-base bg-white border-2 border-[#d4cec4] rounded-xl focus:border-[#C4B5A0] outline-none transition-colors"
                              placeholder={
                                currentContraindicationObject.followUpPlaceholder
                              }
                              value={String(
                                formData.przeciwwskazania[
                                  `${currentContraindicationKey}_details`
                                ] ?? "",
                              )}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  przeciwwskazania: {
                                    ...prev.przeciwwskazania,
                                    [`${currentContraindicationKey}_details`]:
                                      e.target.value,
                                  },
                                }));
                              }}
                            />
                          </div>
                        )}

                      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                        <button
                          type="button"
                          onClick={() => handleWizardAnswer(false)}
                          className={`py-4 px-6 rounded-xl border-2 transition-all text-lg font-medium shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center ${
                            currentContraindicationObject?.hasFollowUp &&
                            formData.przeciwwskazania[
                              currentContraindicationKey
                            ] === false
                              ? "border-green-500 bg-green-500 text-white"
                              : "bg-white border-[#d4cec4] text-[#4a4540] active:border-green-500 active:bg-green-500 active:text-white md:hover:border-green-500 md:hover:bg-green-500 md:hover:text-white"
                          }`}
                        >
                          NIE
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWizardAnswer(true)}
                          className={`py-4 px-6 rounded-xl border-2 transition-all text-lg font-medium shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center ${
                            currentContraindicationObject?.hasFollowUp &&
                            formData.przeciwwskazania[
                              currentContraindicationKey
                            ] === true
                              ? "border-red-500 bg-red-500 text-white"
                              : "bg-white border-[#d4cec4] text-[#4a4540] active:border-red-500 active:bg-red-500 active:text-white md:hover:border-red-500 md:hover:bg-red-500 md:hover:text-white"
                          }`}
                        >
                          TAK
                        </button>
                      </div>

                      {currentContraindicationObject?.hasFollowUp &&
                        formData.przeciwwskazania[
                          currentContraindicationKey
                        ] !== null && (
                          <div className="max-w-md mx-auto mt-4">
                            <button
                              type="button"
                              onClick={handleNextStep}
                              className="w-full py-4 px-6 rounded-xl bg-[#4a4540] text-white transition-all text-lg font-medium shadow-sm hover:shadow-md hover:bg-[#2C2622] active:scale-95 flex items-center justify-center"
                            >
                              Dalej →
                            </button>
                          </div>
                        )}

                      <div className="mt-8 flex justify-between items-center border-t border-[#d4cec4] pt-6">
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentContraindicationIndex((prev) =>
                              Math.max(0, prev - 1),
                            )
                          }
                          disabled={currentContraindicationIndex === 0}
                          className="flex items-center gap-2 text-sm text-[#4a4540]/50 disabled:opacity-0 hover:text-[#C4B5A0] transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Poprzednie
                        </button>
                        <span className="text-xs text-[#C4B5A0] uppercase tracking-wider font-medium">
                          Krok {currentContraindicationIndex + 1}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-500" />
                          </div>
                          <span className="text-green-400 font-medium">
                            Wywiad medyczny zakończony
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={resetWizard}
                          className="text-sm text-green-400 hover:text-green-300 font-medium underline"
                        >
                          Edytuj odpowiedzi
                        </button>
                      </div>

                      {Object.entries(biostymulatoryContraindications).map(
                        ([key, value], index) => {
                          const questionText =
                            typeof value === "string" ? value : value.text;
                          const hasFollowUp =
                            typeof value === "object" && value.hasFollowUp;
                          const followUpDetails =
                            formData.przeciwwskazania[`${key}_details`];

                          return (
                            <div
                              key={key}
                              className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                                formData.przeciwwskazania[key]
                                  ? "bg-red-500/5 border border-red-500/20"
                                  : "bg-green-500/5 border border-green-500/15"
                              }`}
                            >
                              <span className="text-[#C4B5A0] font-medium min-w-[1.5rem] mt-0.5">
                                {index + 1}.
                              </span>
                              <div className="flex-1">
                                <p className="text-[#4a4540] text-sm leading-relaxed">
                                  {questionText}
                                </p>
                                {hasFollowUp &&
                                  formData.przeciwwskazania[key] &&
                                  followUpDetails && (
                                    <p className="text-[#C4B5A0] text-xs mt-2 italic">
                                      → {followUpDetails}
                                    </p>
                                  )}
                              </div>
                              <div className="ml-2">
                                {formData.przeciwwskazania[key] ? (
                                  <span className="inline-flex items-center px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-full border border-red-500/20 whitespace-nowrap">
                                    TAK
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20 whitespace-nowrap">
                                    NIE
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Skutki Uboczne i Powikłania */}
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-[#8b7355]/40">
                <h2 className="text-2xl font-serif text-[#4a4540] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#4a4540] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    5
                  </span>
                  Informacje o Skutkach Ubocznych i Powikłaniach
                </h2>

                <div className="space-y-6">
                  {/* Częste skutki uboczne */}
                  <div className="bg-[#f8f6f3] p-5 rounded-xl border border-[#d4cec4]">
                    <p className="text-sm font-medium text-[#4a4540] mb-3">
                      MOŻLIWE DO WYSTĄPIENIA SKUTKI UBOCZNE PO PRZEPROWADZONYM
                      ZABIEGU - CZĘSTE
                    </p>
                    <ul className="space-y-2 text-sm text-[#4a4540]">
                      {biostymulatorySideEffects.map((reaction, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-[#C4B5A0]">∙</span>
                          <span>{reaction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rzadkie powikłania */}
                  <div className="bg-[#f8f6f3] p-5 rounded-xl border border-[#d4cec4]">
                    <p className="text-sm font-medium text-[#4a4540] mb-3">
                      MOŻLIWE POWIKŁANIA PO PRZEPROWADZONYM ZABIEGU – RZADKIE
                    </p>
                    <ul className="space-y-2 text-sm text-[#4a4540]">
                      {biostymulatoryComplications.rzadkie.map(
                        (complication, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-[#C4B5A0]">∙</span>
                            <span>{complication}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  {/* Bardzo rzadkie powikłania */}
                  <div className="bg-[#f8f6f3] p-5 rounded-xl border border-[#d4cec4]/50">
                    <p className="text-sm font-medium text-[#4a4540] mb-3">
                      MOŻLIWE POWIKŁANIA PO PRZEPROWADZONYM ZABIEGU – BARDZO
                      RZADKIE
                    </p>
                    <ul className="space-y-2 text-sm text-[#4a4540]">
                      {biostymulatoryComplications.bardzoRzadkie.map(
                        (complication, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-[#C4B5A0]">∙</span>
                            <span>{complication}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Zalecenia Przedzabiegowe */}
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mt-8">
                <h2 className="text-2xl font-serif text-[#4a4540] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#4a4540] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    6
                  </span>
                  Zalecenia Przedzabiegowe
                </h2>

                <div className="bg-[#f8f6f3] p-5 rounded-xl border border-[#d4cec4] mb-6">
                  <p className="text-sm font-medium text-[#4a4540] mb-3">
                    ZALECENIA PRZED PRZEPROWADZENIEM ZABIEGU:
                  </p>
                  <ul className="space-y-2 text-sm text-[#4a4540]">
                    {biostymulatoryPreTreatment.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#C4B5A0]">∙</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Zalecenia Pozabiegowe */}
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-[#8b7355]/40">
                <h2 className="text-2xl font-serif text-[#4a4540] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#4a4540] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    7
                  </span>
                  Zalecenia Pozabiegowe
                </h2>

                <div className="bg-[#f8f6f3] p-5 rounded-xl border border-[#d4cec4] mb-6">
                  <p className="text-sm text-[#4a4540] leading-relaxed mb-4">
                    <strong>
                      Niniejszym oświadczam, że zostałam/em poinformowana/y o
                      konieczności stosowania się po przeprowadzonym zabiegu do
                      przestrzegania następujących zaleceń:
                    </strong>
                  </p>
                  <ul className="space-y-2 text-sm text-[#4a4540]">
                    {biostymulatoryPostTreatment.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#C4B5A0]">∙</span>
                        <span
                          className={
                            instruction.startsWith("UWAGA")
                              ? "font-bold text-[#C4B5A0]"
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

              <div className="flex justify-end pt-4 pb-12">
                <button
                  type="button"
                  onClick={() => setShowSignatureModal(true)}
                  disabled={!isStep1Valid}
                  className="bg-[#4a4540] text-white py-4 px-8 rounded-xl text-lg font-medium shadow-lg hover:bg-[#2C2622] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3"
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
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-serif text-[#4a4540] mb-6">
                    {rodoInfo.consentTitle}
                  </h3>
                  <div className="bg-[#f8f6f3] p-6 rounded-xl text-sm text-[#4a4540] leading-relaxed whitespace-pre-line max-h-[60vh] overflow-y-auto mb-6 border border-[#d4cec4]">
                    {rodoInfo.consentText}
                  </div>
                  {/* Signature Area for RODO */}
                  <div className="mt-8">
                    <p className="text-sm text-[#4a4540] mb-4 font-medium uppercase tracking-wide">
                      Podpis Klienta (Zgoda na przetwarzanie danych):
                    </p>
                    <div className="bg-white rounded-xl overflow-hidden min-h-[200px] border border-[#d4cec4] p-1">
                      <SignaturePad
                        label=""
                        value={formData.podpisRodo || ""}
                        onChange={(sig) => {
                          handleInputChange("podpisRodo", sig);
                          // Auto-approve RODO consent when signed
                          if (sig && !formData.zgodaPrzetwarzanieDanych) {
                            handleInputChange("zgodaPrzetwarzanieDanych", true);
                          }
                        }}
                        date={formData.miejscowoscData}
                        hasBorder={false}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex justify-between pt-4 pb-12">
                <button
                  type="button"
                  onClick={() => setCurrentStep("DATA")}
                  className="text-[#C4B5A0] hover:text-[#4a4540] px-6 py-3 font-medium transition-colors"
                >
                  ← Wróć do danych
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep("RODO2")}
                  disabled={!formData.podpisRodo}
                  className="bg-[#4a4540] text-white py-3 px-8 rounded-xl text-lg font-medium shadow-lg hover:bg-[#2C2622] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Dalej →
                </button>
              </div>
            </div>
          )}

          {/* KROK 3: RODO 2 */}
          {currentStep === "RODO2" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-serif text-[#4a4540] mb-6">
                    {rodoInfo.clauseTitle}
                  </h3>
                  <div className="bg-[#f8f6f3] p-6 rounded-xl text-sm text-[#4a4540] leading-relaxed whitespace-pre-line max-h-[60vh] overflow-y-auto mb-6 border border-[#d4cec4]">
                    {rodoInfo.clauseText}
                  </div>
                  {/* Signature Area for RODO 2 */}
                  <div className="mt-8">
                    <SignaturePad
                        label="Podpis Klienta (Klauzula informacyjna):"
                        value={formData.podpisRodo2 || ""}
                        onChange={(sig) => {
                          handleInputChange("podpisRodo2", sig);
                        }}
                        date={formData.miejscowoscData}
                      />
                    <p className="text-xs text-[#4a4540]/50 mt-3 italic">
                      Złożenie podpisu jest równoznaczne z zapoznaniem się z
                      powyższą klauzulą informacyjną RODO.
                    </p>
                  </div>
                </div>
              </section>

              <div className="flex justify-between pt-4 pb-12">
                <button
                  type="button"
                  onClick={() => setCurrentStep("RODO")}
                  className="text-[#C4B5A0] hover:text-[#4a4540] px-6 py-3 font-medium transition-colors"
                >
                  ← Wróć do RODO
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep("TREATMENT")}
                  disabled={!formData.podpisRodo2}
                  className="bg-[#4a4540] text-white py-3 px-8 rounded-xl text-lg font-medium shadow-lg hover:bg-[#2C2622] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Dalej →
                </button>
              </div>
            </div>
          )}

          {/* KROK 3: ZABIEG */}
          {currentStep === "TREATMENT" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Ryzyko Hyaluronic */}
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-serif text-[#4a4540] mb-6 border-b border-[#d4cec4] pb-2">
                    Świadomość Ryzyka
                  </h3>
                  <p className="text-sm text-[#4a4540] mb-4">
                    Zostałam/em poinformowana/y o przebiegu zabiegu i możliwości
                    naturalnego wystąpienia ryzyka:
                  </p>

                  <div className="space-y-6">
                    <div className="bg-[#f8f6f3] p-5 rounded-xl border border-[#d4cec4]">
                      <p className="text-sm font-medium text-[#4a4540] mb-3">
                        Możliwe naturalne reakcje:
                      </p>
                      <ul className="space-y-2 text-sm text-[#4a4540]">
                        {biostymulatorySideEffects.map((reaction, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-[#C4B5A0]">•</span>
                            {reaction}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#f8f6f3] p-5 rounded-xl border border-[#d4cec4]">
                      <p className="text-sm font-medium text-[#4a4540] mb-3">
                        Możliwe powikłania:
                      </p>
                      <div className="space-y-3 text-sm text-[#4a4540]">
                        <p>
                          <span className="font-medium">Rzadkie:</span>{" "}
                          {biostymulatoryComplications.rzadkie.join(", ")}
                        </p>
                        <p>
                          <span className="font-medium">Bardzo rzadkie:</span>{" "}
                          {biostymulatoryComplications.bardzoRzadkie.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Zalecenia Hyaluronic */}
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-serif text-[#4a4540] mb-6 border-b border-[#d4cec4] pb-2">
                    Zobowiązania Pozabiegowe
                  </h3>
                  <p className="text-sm text-[#4a4540] mb-4">
                    Zobowiązuję się do przestrzegania następujących zaleceń:
                  </p>
                  <ul className="space-y-2 text-[#4a4540] text-sm bg-[#f8f6f3] p-4 rounded-xl border border-[#d4cec4]/30">
                    {biostymulatoryPostTreatment.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#C4B5A0]">•</span>
                        <span
                          className={
                            instruction.startsWith("UWAGA")
                              ? "font-bold text-[#C4B5A0]"
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
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-[#8b7355]/40">
                <h3 className="text-2xl font-serif text-[#4a4540] mb-6 border-b border-[#d4cec4] pb-2">
                  Oświadczenia
                </h3>
                <div className="bg-[#f8f6f3] p-5 rounded-xl mb-6 border border-[#d4cec4]">
                  <h4 className="font-serif text-[#4a4540] text-lg mb-4">
                    OŚWIADCZENIA I ZGODY KLIENTA
                  </h4>
                  <div className="space-y-4 text-sm text-[#4a4540] leading-relaxed">
                    <p>
                      <strong>Informacja o zabiegu:</strong> Oświadczam, że
                      otrzymałam/em od Specjalisty pełną i rzetelną informację
                      na temat wskazań do przeprowadzenia zabiegu stymulatorami
                      tkankowymi, techniki jego wykonania oraz spodziewanych
                      efektów. Miałam/em możliwość zadawania pytań, na które
                      uzyskałam/em wyczerpujące odpowiedzi.
                    </p>
                    <p>
                      <strong>Stan zdrowia:</strong> Oświadczam, że
                      udzieliłam/em prawdziwych i pełnych odpowiedzi na pytania
                      dotyczące mojego stanu zdrowia. Rozumiem, że rzetelność
                      tych informacji jest kluczowa dla bezpieczeństwa zabiegu.
                    </p>
                    <p>
                      <strong>Świadomość efektów:</strong> Przyjmuję do
                      wiadomości, że efekty zabiegu są kwestią indywidualną i
                      zależą od biochemii organizmu, rodzaju skóry oraz
                      prowadzonego trybu życia. Rozumiem, że nie można w pełni
                      zagwarantować konkretnego rezultatu, a brak satysfakcji
                      wynikający z moich subiektywnych oczekiwań nie może być
                      podstawą roszczeń.
                    </p>
                    <p>
                      <strong>Ryzyko i powikłania:</strong> Zostałam/em
                      poinformowana/ny o możliwości wystąpienia reakcji
                      niepożądanych, takich jak: zaczerwienienie, opuchlizna,
                      zasinienia w miejscu wkłucia, reakcja alergiczna na
                      preparat lub środek znieczulający. Rozumiem, że
                      wystąpienie tych następstw, o ile zabieg wykonano zgodnie
                      ze sztuką, nie uprawnia mnie do wnoszenia roszczeń
                      odszkodowawczych.
                    </p>
                    <p>
                      <strong>Zalecenia pozabiegowe:</strong> Zobowiązuję się do
                      ścisłego przestrzegania instrukcji pielęgnacji
                      przekazanych przez Specjalistę. Przyjmuję do wiadomości,
                      że niestosowanie się do zaleceń może skutkować
                      wystąpieniem infekcji, powstaniem blizn lub innymi
                      powikłaniami.
                    </p>
                    <div className="bg-[#f8f6f3] p-4 rounded-lg border border-[#d4cec4]/30 my-4 space-y-4">
                      <p>
                        <strong>Seria zabiegowa:</strong> Poinformowano mnie, że
                        dla uzyskania optymalnych efektów (utrzymujących się
                        zazwyczaj do 6 miesięcy) zabieg należy wykonać w serii.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[#4a4540] mb-1">
                            Planowana ilość zabiegów w serii:
                          </label>
                          <input
                            type="text"
                            value={formData.planowanaIloscZabiegow || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "planowanaIloscZabiegow",
                                e.target.value,
                              )
                            }
                            placeholder="np. 3-4"
                            className="w-full bg-white border border-[#d4cec4] rounded-lg px-3 py-2 text-[#4a4540] focus:ring-1 focus:ring-[#C4B5A0] focus:border-[#C4B5A0] outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#4a4540] mb-1">
                            Odstęp między 1. a 2. zabiegiem (dni):
                          </label>
                          <input
                            type="text"
                            value={formData.odstepMiedzyZabiegami || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "odstepMiedzyZabiegami",
                                e.target.value,
                              )
                            }
                            placeholder="np. 14"
                            className="w-full bg-white border border-[#d4cec4] rounded-lg px-3 py-2 text-[#4a4540] focus:ring-1 focus:ring-[#C4B5A0] focus:border-[#C4B5A0] outline-none text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-[#4a4540] mb-1">
                            Kolejne zabiegi w odstępach (dni):
                          </label>
                          <input
                            type="text"
                            value={formData.kolejneZabiegiOdstepy || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "kolejneZabiegiOdstepy",
                                e.target.value,
                              )
                            }
                            placeholder="np. 21"
                            className="w-full bg-white border border-[#d4cec4] rounded-lg px-3 py-2 text-[#4a4540] focus:ring-1 focus:ring-[#C4B5A0] focus:border-[#C4B5A0] outline-none text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <p>
                      <strong>Higiena i status Specjalisty:</strong>{" "}
                      Potwierdzam, że materiały użyte do zabiegu są jednorazowe
                      i zostały otwarte w mojej obecności. Mam świadomość, że
                      Specjalista wykonujący zabieg posiada bogate
                      doświadczenie, lecz nie jest lekarzem medycyny
                      estetycznej.
                    </p>
                    <p>
                      <strong>Dobrowolność:</strong> Oświadczam, że moja decyzja
                      o poddaniu się zabiegowi jest świadoma, dobrowolna i
                      przemyślana.
                    </p>
                    <p>
                      <strong>POTWIERDZENIE I PODPISY:</strong> Zostałam/em
                      wyczerpująco poinformowana/ny o ryzyku i skutkach
                      ubocznych. Rozumiem treść niniejszego dokumentu i
                      akceptuję go w całości.
                    </p>
                  </div>
                </div>

                {/* Podpis pod Zabiegiem (Nowy, obowiązkowy) */}
                <div className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mt-8">
                  <h3 className="text-xl font-serif text-[#4a4540] mb-4 border-b border-[#d4cec4] pb-2">
                    Potwierdzenie Zgody na Zabieg
                  </h3>
                  <p className="text-sm text-[#4a4540] mb-6">
                    Składając podpis poniżej potwierdzam, że zapoznałam/em się z
                    powyższymi informacjami, ryzykiem oraz zaleceniami i wyrażam
                    świadomą zgodę na przeprowadzenie zabiegu.
                  </p>
                  <SignaturePad
                    label="Podpis Klienta (Wymagany)"
                    value={formData.podpisDane}
                    onChange={(sig) => {
                      handleInputChange("podpisDane", sig);
                      // Możemy tu też ustawić flagę zgody, np. zgodaPomocPrawna (repurposed) lub po prostu polegać na podpisie
                      // Dla spójności z backendem, ustawmy zgodaPomocPrawna na true
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
                  className="text-[#C4B5A0] hover:text-[#4a4540] px-6 py-3 font-medium transition-colors"
                >
                  ← Wróć do RODO
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep("MARKETING")}
                  disabled={!formData.podpisDane}
                  className="bg-[#4a4540] text-white py-3 px-8 rounded-xl text-lg font-medium shadow-lg hover:bg-[#2C2622] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Dalej (Zgody dodatkowe) →
                </button>
              </div>
            </div>
          )}

          {/* KROK 4: MARKETING */}
          {currentStep === "MARKETING" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-[#8b7355]/40">
                <h3 className="text-2xl font-serif text-[#4a4540] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#4a4540] text-white rounded-full flex items-center justify-center text-sm font-sans">
                    8
                  </span>
                  Zgody Dodatkowe
                </h3>
                <p className="text-sm text-[#4a4540] mb-6">
                  Poniższe zgody są <strong>opcjonalne</strong>.
                </p>

                {/* Zgoda na marketing */}
                <div className="bg-white backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-[#d4cec4] hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h4 className="font-serif text-[#4a4540] text-lg mb-3">
                      Zgoda Marketingowa
                    </h4>
                    <p className="text-sm text-[#4a4540] leading-relaxed mb-6">
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
                <div className="bg-white backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-[#d4cec4] hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h4 className="font-serif text-[#4a4540] text-lg mb-3">
                      Zgoda na Wykorzystanie Wizerunku
                    </h4>
                    <p className="text-sm text-[#4a4540] leading-relaxed mb-4">
                      Wyrażam nieodpłatną zgodę na utrwalenie i
                      rozpowszechnianie mojego wizerunku (zdjęcia/video efektów
                      zabiegu) w celach promocyjnych salonu {SALON_CONFIG.name}.
                    </p>

                    <div className="mb-6">
                      <label className="block text-xs uppercase tracking-wider text-[#4a4540]/50 mb-2 font-medium">
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
                        className="w-full px-4 py-2 bg-white border-b border-[#d4cec4] focus:border-[#C4B5A0] outline-none text-sm transition-colors text-[#4a4540]"
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
              </section>

              <div className="flex justify-between pt-4 pb-12 items-center border-t border-[#d4cec4] mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep("TREATMENT")}
                  className="text-[#C4B5A0] hover:text-[#4a4540] px-6 py-3 font-medium transition-colors"
                >
                  ← Wróć do zabiegu
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isSignatureVerified}
                  className="bg-[#4a4540] text-white py-4 px-12 rounded-xl text-lg font-medium shadow-lg hover:bg-[#2C2622] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
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
