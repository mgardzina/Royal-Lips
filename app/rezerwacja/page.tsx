"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Heart,
  AlertCircle,
  Check,
} from "lucide-react";
import { type BookingFormData } from "../../types/booking";
import { SERVICES } from "../../data/services";
// import { supabase } from "../../lib/Supabase";
import CalendarPicker from "../../components/CalendarPicker";

export default function RezerwacjaPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<
    Array<{ date: string; time: string }>
  >([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    serviceType: "pigmentacja-brwi",
    hasAllergies: false,
    isPregnant: false,
    hasSkinConditions: false,
    takingMedication: false,
    consentPersonalData: false,
    consentMarketing: false,
  });

  // Pobierz zajęte terminy z API
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        setIsLoadingBookings(true);
        const response = await fetch("/api/get-bookings");
        const data = await response.json();

        if (data.success && data.bookings) {
          setBookedSlots(data.bookings);
        }
      } catch (error) {
        console.error("Błąd pobierania zajętych terminów:", error);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookedSlots();
  }, []);

  const updateFormData = (field: keyof BookingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validation for step 1
  const isStep1Valid = () => {
    return !!(
      formData.firstName?.trim() &&
      formData.lastName?.trim() &&
      formData.email?.trim() &&
      formData.phone?.trim()
    );
  };

  // Validation for step 2
  const isStep2Valid = () => {
    return !!(
      formData.serviceType &&
      formData.preferredDate &&
      formData.preferredTime
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Find the selected service to get category and name
      const selectedService = SERVICES.find(
        (s) => s.id === formData.serviceType,
      );

      const sheetData = {
        "Data wysłania": new Date().toLocaleString("pl-PL"),
        Imię: formData.firstName,
        Nazwisko: formData.lastName,
        Email: formData.email,
        Telefon: formData.phone,
        Kategoria: selectedService?.category || "Inne",
        Usługa: selectedService?.name || formData.serviceType,
        "Data wizyty": formData.preferredDate,
        Godzina: formData.preferredTime,
        Alergie: formData.hasAllergies
          ? `Tak: ${formData.allergiesDetails || ""}`
          : "Nie",
        Ciąża: formData.isPregnant ? "Tak" : "Nie",
        "Choroby skóry": formData.hasSkinConditions
          ? `Tak: ${formData.skinConditionsDetails || ""}`
          : "Nie",
        Leki: formData.takingMedication
          ? `Tak: ${formData.medicationDetails || ""}`
          : "Nie",
        Uwagi: formData.additionalNotes || "Brak uwag",
        Status: "Oczekiwanie na potwierdzenie",
      };

      // Send to Google Sheets via SheetDB
      const response = await fetch("https://sheetdb.io/api/v1/gmhy5mfhbnppt", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sheetData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("SheetDB Error:", errorText);
        throw new Error(`Błąd zapisu do arkusza: ${errorText}`);
      }

      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } catch (emailError) {
        console.error("Błąd wysyłki email:", emailError);
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Błąd podczas rezerwacji:", error);
      alert(
        "Wystąpił błąd. Spróbuj ponownie lub skontaktuj się telefonicznie.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-bg-light p-12 text-center">
          <div className="w-20 h-20 border-2 border-text-light flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-text-light" />
          </div>

          <h2 className="text-3xl font-serif font-light text-text-light mb-6 tracking-wider uppercase">
            Rezerwacja przyjęta
          </h2>

          <p className="text-text-light/70 mb-12 font-light tracking-wide">
            Dziękujemy za wypełnienie formularza. Skontaktujemy się z Tobą w
            ciągu 24h w celu potwierdzenia terminu wizyty.
          </p>

          <Link
            href="/"
            className="inline-flex items-center space-x-3 bg-text-light text-text-dark px-8 py-4 font-light text-sm tracking-widest hover:bg-accent-warm hover:text-text-light transition-all uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Powrót</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Header */}
      <div className="bg-bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-text-dark hover:text-primary-taupe transition-colors font-light text-sm tracking-wider uppercase mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Powrót</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-serif font-light text-text-dark tracking-wider uppercase">
            Rezerwacja
          </h1>

          <p className="text-text-dark/70 mt-4 font-light tracking-wide">
            Wypełnij poniższy formularz, a my skontaktujemy się z Tobą w celu
            potwierdzenia wizyty
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-bg-light border-t border-text-dark/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 border flex items-center justify-center font-light text-sm transition-all ${
                    step >= s
                      ? "border-text-light bg-primary-taupe text-text-light"
                      : "border-text-dark/20 text-text-dark/40"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-px mx-2 transition-all ${
                      step > s ? "bg-primary-taupe" : "bg-text-dark/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <form onSubmit={handleSubmit} className="bg-bg-light p-8 md:p-12">
          {/* Step 1: Dane personalne */}
          {step === 1 && (
            <div className="space-y-8 fade-in">
              <div className="flex items-center space-x-3 mb-8">
                <User className="w-5 h-5 text-text-dark" />
                <h2 className="text-2xl font-serif font-light text-text-dark tracking-wider uppercase">
                  Dane personalne
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-light text-text-dark mb-3 tracking-wider uppercase">
                    Imię *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName || ""}
                    onChange={(e) =>
                      updateFormData("firstName", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-text-dark/20 bg-bg-main/50 focus:border-primary-taupe outline-none transition-colors font-light"
                    placeholder="Twoje imię"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light text-text-dark mb-3 tracking-wider uppercase">
                    Nazwisko *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName || ""}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    className="w-full px-4 py-3 border border-text-dark/20 bg-bg-main/50 focus:border-primary-taupe outline-none transition-colors font-light"
                    placeholder="Twoje nazwisko"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light text-text-dark mb-3 tracking-wider uppercase">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    value={formData.email || ""}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (!target.value.includes("@")) {
                        target.setCustomValidity("Email musi zawierać znak @");
                      } else if (!target.value.match(/\.[a-zA-Z]{2,}$/)) {
                        target.setCustomValidity(
                          "Email musi zawierać domenę (np. @gmail.com)"
                        );
                      } else {
                        target.setCustomValidity(
                          "Wpisz poprawny adres email (np. twoj@email.com)"
                        );
                      }
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity("");
                    }}
                    className="w-full px-4 py-3 border border-text-dark/20 bg-bg-main/50 focus:border-primary-taupe outline-none transition-colors font-light"
                    placeholder="twoj@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light text-text-dark mb-3 tracking-wider uppercase">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone || "+48 "}
                    onChange={(e) => {
                      const input = e.target.value;
                      // Jeśli użytkownik próbuje usunąć +48, przywróć to
                      if (!input.startsWith("+48")) {
                        updateFormData("phone", "+48 ");
                        return;
                      }
                      // Wyciągnij tylko cyfry po prefiksie +48
                      const afterPrefix = input.substring(3);
                      const digitsOnly = afterPrefix.replace(/\D/g, "");
                      // Ogranicz do 9 cyfr
                      const limitedDigits = digitsOnly.slice(0, 9);
                      // Formatuj: +48 XXX XXX XXX
                      let formatted = "+48";
                      if (limitedDigits.length > 0) {
                        formatted += " " + limitedDigits.slice(0, 3);
                      }
                      if (limitedDigits.length > 3) {
                        formatted += " " + limitedDigits.slice(3, 6);
                      }
                      if (limitedDigits.length > 6) {
                        formatted += " " + limitedDigits.slice(6, 9);
                      }
                      updateFormData("phone", formatted);
                    }}
                    onFocus={(e) => {
                      // Jeśli pole jest puste, ustaw +48
                      if (!formData.phone || formData.phone === "") {
                        updateFormData("phone", "+48 ");
                      }
                      // Ustaw kursor po prefiksie
                      setTimeout(() => {
                        e.target.setSelectionRange(4, 4);
                      }, 0);
                    }}
                    className="w-full px-4 py-3 border border-text-dark/20 bg-bg-main/50 focus:border-primary-taupe outline-none transition-colors font-light"
                    placeholder="+48 123 456 789"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!isStep1Valid()}
                className="w-full bg-primary-taupe text-text-light py-4 font-light text-sm tracking-widest hover:bg-accent-warm transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed border-2 border-primary-taupe/30 hover:border-accent-warm shadow-md"
              >
                Dalej
              </button>
              {!isStep1Valid() && (
                <p className="text-sm text-red-500 text-center mt-2 font-light">
                  Wypełnij wszystkie wymagane pola
                </p>
              )}
            </div>
          )}

          {/* Step 2: Wybór usługi i terminu */}
          {step === 2 && (
            <div className="space-y-8 fade-in">
              <div className="flex items-center space-x-3 mb-8">
                <Calendar className="w-5 h-5 text-text-dark" />
                <h2 className="text-2xl font-serif font-light text-text-dark tracking-wider uppercase">
                  Usługa i termin
                </h2>
              </div>

              <div>
                <label className="block text-xs font-light text-text-dark mb-4 tracking-wider uppercase">
                  Wybierz kategorię i usługę *
                </label>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { id: "PMU", label: "Makijaż Permanentny" },
                    { id: "KWAS", label: "Kwas Hialuronowy" },
                    { id: "MEZOTERAPIA", label: "Mezoterapia" },
                  ].map((cat) => {
                    const isActive =
                      SERVICES.find((s) => s.id === formData.serviceType)
                        ?.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          const firstService = SERVICES.find(
                            (s) => s.category === cat.id && s.id !== "inne",
                          );
                          if (firstService)
                            updateFormData("serviceType", firstService.id);
                        }}
                        className={`px-4 py-2 text-sm font-light tracking-wider transition-all rounded-full ${
                          isActive
                            ? "bg-primary-taupe text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SERVICES.filter((s) => {
                    const currentCategory = SERVICES.find(
                      (srv) => srv.id === formData.serviceType,
                    )?.category;
                    return s.category === currentCategory && s.id !== "inne";
                  }).map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => updateFormData("serviceType", service.id)}
                      className={`p-4 text-left rounded-xl transition-all ${
                        formData.serviceType === service.id
                          ? "bg-primary-taupe text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 shadow-sm"
                      }`}
                    >
                      <div className="font-medium text-sm">{service.name}</div>
                      <div
                        className={`text-xs mt-1 ${
                          formData.serviceType === service.id
                            ? "text-white/70"
                            : "text-gray-400"
                        }`}
                      >
                        {service.duration}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Other/Consultation option */}
                <button
                  type="button"
                  onClick={() => updateFormData("serviceType", "inne")}
                  className={`mt-3 w-full p-4 text-left rounded-xl transition-all ${
                    formData.serviceType === "inne"
                      ? "bg-primary-taupe text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 shadow-sm"
                  }`}
                >
                  <div className="font-medium text-sm">
                    Inna usługa / Konsultacja
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      formData.serviceType === "inne"
                        ? "text-white/70"
                        : "text-gray-400"
                    }`}
                  >
                    Skontaktujemy się w sprawie szczegółów
                  </div>
                </button>
              </div>

              {isLoadingBookings ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <p className="text-gray-500">Ładowanie dostępnych terminów...</p>
                </div>
              ) : (
                <CalendarPicker
                  selectedDate={formData.preferredDate || ""}
                  selectedTime={formData.preferredTime || ""}
                  onDateChange={(date) => updateFormData("preferredDate", date)}
                  onTimeChange={(time) => updateFormData("preferredTime", time)}
                  bookedSlots={bookedSlots}
                />
              )}

              <div className="bg-bg-main/50 p-6 flex items-start space-x-3 border border-text-dark/10">
                <AlertCircle className="w-5 h-5 text-text-dark/50 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text-dark/70 font-light">
                  Termin zostanie potwierdzony telefonicznie lub emailem. Podana
                  data jest Twoją preferencją.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-text-dark/30 text-text-dark py-4 font-light text-sm tracking-widest hover:bg-bg-main/50 hover:border-text-dark/50 transition-all uppercase shadow-sm"
                >
                  Wstecz
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!isStep2Valid()}
                  className="flex-1 bg-primary-taupe text-text-light py-4 font-light text-sm tracking-widest hover:bg-accent-warm transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed border-2 border-primary-taupe/30 hover:border-accent-warm shadow-md"
                >
                  Dalej
                </button>
              </div>
              {!isStep2Valid() && (
                <p className="text-sm text-red-500 text-center mt-2 font-light">
                  Wybierz usługę, datę i godzinę
                </p>
              )}
            </div>
          )}

          {/* Step 3: Wywiad zdrowotny */}
          {step === 3 && (
            <div className="space-y-8 fade-in">
              <div className="flex items-center space-x-3 mb-8">
                <Heart className="w-5 h-5 text-text-dark" />
                <h2 className="text-2xl font-serif font-light text-text-dark tracking-wider uppercase">
                  Wywiad zdrowotny
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-bg-main/50 p-6 border border-text-dark/10">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasAllergies || false}
                      onChange={(e) =>
                        updateFormData("hasAllergies", e.target.checked)
                      }
                      className="mt-1 w-5 h-5 border-2 border-text-dark/30 text-primary-taupe focus:ring-primary-taupe"
                    />
                    <div className="flex-1">
                      <span className="font-light text-text-dark text-sm tracking-wide">
                        Czy masz alergie?
                      </span>
                      {formData.hasAllergies && (
                        <textarea
                          value={formData.allergiesDetails || ""}
                          onChange={(e) =>
                            updateFormData("allergiesDetails", e.target.value)
                          }
                          className="w-full mt-3 px-4 py-3 border border-text-dark/20 bg-bg-light focus:border-primary-taupe outline-none transition-colors font-light text-sm"
                          placeholder="Opisz swoje alergie..."
                          rows={2}
                        />
                      )}
                    </div>
                  </label>
                </div>

                <div className="bg-bg-main/50 p-6 border border-text-dark/10">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPregnant || false}
                      onChange={(e) =>
                        updateFormData("isPregnant", e.target.checked)
                      }
                      className="mt-1 w-5 h-5 border-2 border-text-dark/30 text-primary-taupe focus:ring-primary-taupe"
                    />
                    <span className="font-light text-text-dark text-sm tracking-wide">
                      Czy jesteś w ciąży lub karmisz piersią?
                    </span>
                  </label>
                </div>

                <div className="bg-bg-main/50 p-6 border border-text-dark/10">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasSkinConditions || false}
                      onChange={(e) =>
                        updateFormData("hasSkinConditions", e.target.checked)
                      }
                      className="mt-1 w-5 h-5 border-2 border-text-dark/30 text-primary-taupe focus:ring-primary-taupe"
                    />
                    <div className="flex-1">
                      <span className="font-light text-text-dark text-sm tracking-wide">
                        Czy masz choroby skóry?
                      </span>
                      {formData.hasSkinConditions && (
                        <textarea
                          value={formData.skinConditionsDetails || ""}
                          onChange={(e) =>
                            updateFormData(
                              "skinConditionsDetails",
                              e.target.value,
                            )
                          }
                          className="w-full mt-3 px-4 py-3 border border-text-dark/20 bg-bg-light focus:border-primary-taupe outline-none transition-colors font-light text-sm"
                          placeholder="Opisz schorzenia..."
                          rows={2}
                        />
                      )}
                    </div>
                  </label>
                </div>

                <div className="bg-bg-main/50 p-6 border border-text-dark/10">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.takingMedication || false}
                      onChange={(e) =>
                        updateFormData("takingMedication", e.target.checked)
                      }
                      className="mt-1 w-5 h-5 border-2 border-text-dark/30 text-primary-taupe focus:ring-primary-taupe"
                    />
                    <div className="flex-1">
                      <span className="font-light text-text-dark text-sm tracking-wide">
                        Czy przyjmujesz leki?
                      </span>
                      {formData.takingMedication && (
                        <textarea
                          value={formData.medicationDetails || ""}
                          onChange={(e) =>
                            updateFormData("medicationDetails", e.target.value)
                          }
                          className="w-full mt-3 px-4 py-3 border border-text-dark/20 bg-bg-light focus:border-primary-taupe outline-none transition-colors font-light text-sm"
                          placeholder="Jakie leki przyjmujesz?"
                          rows={2}
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-light text-text-dark mb-3 tracking-wider uppercase">
                  Dodatkowe uwagi
                </label>
                <textarea
                  value={formData.additionalNotes || ""}
                  onChange={(e) =>
                    updateFormData("additionalNotes", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-text-dark/20 bg-bg-main/50 focus:border-primary-taupe outline-none transition-colors font-light"
                  placeholder="Czy jest coś, o czym powinniśmy wiedzieć?"
                  rows={3}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border-2 border-text-dark/30 text-text-dark py-4 font-light text-sm tracking-widest hover:bg-bg-main/50 hover:border-text-dark/50 transition-all uppercase shadow-sm"
                >
                  Wstecz
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 bg-primary-taupe text-text-light py-4 font-light text-sm tracking-widest hover:bg-accent-warm transition-all uppercase border-2 border-primary-taupe/30 hover:border-accent-warm shadow-md"
                >
                  Dalej
                </button>
              </div>
            </div>
          )}

          {/* Step 4: RODO i potwierdzenie */}
          {step === 4 && (
            <div className="space-y-8 fade-in">
              <div className="flex items-center space-x-3 mb-8">
                <Check className="w-5 h-5 text-text-dark" />
                <h2 className="text-2xl font-serif font-light text-text-dark tracking-wider uppercase">
                  Zgody i potwierdzenie
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-bg-main/50 p-6 border border-text-dark/10">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consentPersonalData || false}
                      onChange={(e) =>
                        updateFormData("consentPersonalData", e.target.checked)
                      }
                      className="mt-1 w-5 h-5 border-2 border-text-dark/30 text-primary-taupe focus:ring-primary-taupe"
                    />
                    <span className="text-sm text-text-dark font-light">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych w
                      celu realizacji rezerwacji zgodnie z{" "}
                      <a href="#" className="text-primary-taupe underline">
                        polityką prywatności
                      </a>{" "}
                      *
                    </span>
                  </label>
                </div>

                <div className="bg-bg-main/50 p-6 border border-text-dark/10">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consentMarketing || false}
                      onChange={(e) =>
                        updateFormData("consentMarketing", e.target.checked)
                      }
                      className="mt-1 w-5 h-5 border-2 border-text-dark/30 text-primary-taupe focus:ring-primary-taupe"
                    />
                    <span className="text-sm text-text-dark font-light">
                      Wyrażam zgodę na otrzymywanie informacji marketingowych
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-bg-main/50 p-8 border border-primary-taupe/30">
                <h3 className="font-light text-text-dark mb-6 tracking-wider uppercase text-sm">
                  Podsumowanie rezerwacji:
                </h3>
                <div className="space-y-4 text-sm font-light">
                  <div>
                    <span className="text-text-dark/60 uppercase tracking-wider text-xs">
                      Imię i nazwisko:
                    </span>{" "}
                    <span className="text-text-dark block mt-1">
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-dark/60 uppercase tracking-wider text-xs">
                      Email:
                    </span>{" "}
                    <span className="text-text-dark block mt-1">
                      {formData.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-dark/60 uppercase tracking-wider text-xs">
                      Telefon:
                    </span>{" "}
                    <span className="text-text-dark block mt-1">
                      {formData.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-dark/60 uppercase tracking-wider text-xs">
                      Usługa:
                    </span>{" "}
                    <span className="text-text-dark block mt-1">
                      {
                        SERVICES.find((s) => s.id === formData.serviceType)
                          ?.name
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-text-dark/60 uppercase tracking-wider text-xs">
                      Preferowany termin:
                    </span>{" "}
                    <span className="text-text-dark block mt-1">
                      {formData.preferredDate} o {formData.preferredTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 border-2 border-text-dark/30 text-text-dark py-4 font-light text-sm tracking-widest hover:bg-bg-main/50 hover:border-text-dark/50 transition-all uppercase shadow-sm"
                >
                  Wstecz
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.consentPersonalData}
                  className="flex-1 bg-primary-taupe text-text-light py-4 font-light text-sm tracking-widest hover:bg-accent-warm transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase border-2 border-primary-taupe/30 hover:border-accent-warm shadow-md"
                >
                  {isSubmitting ? "Wysyłanie..." : "Potwierdź rezerwację"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
