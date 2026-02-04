"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Trash2,
  Check,
  X,
  Mail,
  Pencil,
  Save,
  XCircle,
} from "lucide-react";
import { contraindicationsByFormType, FormType } from "@/types/booking";

// Funkcja do czyszczenia starego formatu nazwaProduktu (usuwanie emaila)
const cleanNazwaProduktu = (nazwa: string | null): string | null => {
  if (!nazwa) return null;
  // Usuń " | Email: xxx" lub "Email: xxx" ze starego formatu
  const cleaned = nazwa
    .replace(/\s*\|\s*Email:\s*[^\s|]+/gi, "")
    .replace(/^Email:\s*[^\s|]+\s*\|?\s*/gi, "")
    .trim();
  return cleaned || null;
};

interface TreatmentHistory {
  id: string;
  date: string;
  description: string;
}

interface ConsentFormFull {
  id: string;
  type: string;
  createdAt: string;
  imieNazwisko: string;
  email: string | null;
  ulica: string | null;
  kodPocztowy: string | null;
  miasto: string | null;
  dataUrodzenia: string | null;
  telefon: string;
  miejscowoscData: string;
  nazwaProduktu: string | null;
  obszarZabiegu: string | null;
  celEfektu: string | null;
  przeciwwskazania: Record<string, boolean | null>;
  zgodaPrzetwarzanieDanych: boolean;
  zgodaMarketing: boolean;
  zgodaFotografie: boolean;
  zgodaPomocPrawna: boolean;
  miejscaPublikacjiFotografii: string | null;
  podpisDane: string | null;
  podpisMarketing: string | null;
  podpisFotografie: string | null;
  podpisRodo: string | null;
  informacjaDodatkowa: string | null;
  clientId: string | null;
}

const formTypeLabels: Record<string, string> = {
  HYALURONIC: "Kwas hialuronowy",
  PMU: "Makijaż permanentny",
  LASER: "Laser",
};

export default function FormDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState<ConsentFormFull | null>(null);
  const [history, setHistory] = useState<TreatmentHistory[]>([]);
  const [newHistory, setNewHistory] = useState({ date: "", description: "" });
  const [isAddingHistory, setIsAddingHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedForm, setEditedForm] = useState<Partial<ConsentFormFull>>({});
  const [activeTab, setActiveTab] = useState<
    "details" | "contraindications" | "consents"
  >("details");

  useEffect(() => {
    fetchForm();
    fetchHistory();
  }, [params.id]);

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/consent-forms/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setForm(data.form);
        // Oczyść nazwaProduktu ze starego formatu z emailem
        setEditedForm({
          ...data.form,
          nazwaProduktu: cleanNazwaProduktu(data.form.nazwaProduktu) || "",
        });
      }
    } catch (error) {
      console.error("Błąd pobierania formularza:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/consent-forms/${params.id}/history`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Błąd pobierania historii:", error);
    }
  };

  const handleAddHistory = async () => {
    if (!newHistory.date || !newHistory.description) return;

    setIsAddingHistory(true);
    try {
      const response = await fetch(`/api/consent-forms/${params.id}/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHistory),
      });

      if (response.ok) {
        await fetchHistory();
        setNewHistory({ date: "", description: "" });
      }
    } catch (error) {
      console.error("Błąd dodawania historii:", error);
    } finally {
      setIsAddingHistory(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć ten formularz?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/consent-forms/${params.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Błąd usuwania:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/consent-forms/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedForm),
      });
      const data = await response.json();
      if (data.success) {
        setForm(data.form);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Błąd zapisywania:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedForm({
      ...(form || {}),
      nazwaProduktu: cleanNazwaProduktu(form?.nazwaProduktu || null) || "",
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5] flex items-center justify-center">
        <p className="text-[#8b8580]">Ładowanie...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5] flex items-center justify-center">
        <p className="text-[#8b8580]">Formularz nie znaleziony</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5]">
      {/* Header */}
      <header className="bg-[#4a4540]/95 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Powrót</span>
          </Link>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  <span className="hidden md:inline">Anuluj</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 text-green-300 hover:text-green-200 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span className="hidden md:inline">
                    {isSaving ? "Zapisywanie..." : "Zapisz"}
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                  <span className="hidden md:inline">Edytuj</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 text-red-300 hover:text-red-200 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="hidden md:inline">
                    {isDeleting ? "Usuwanie..." : "Usuń"}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header Info - Always Visible */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-serif text-[#4a4540]">
                  {form.imieNazwisko}
                </h1>
                {isEditing ? (
                  <select
                    value={editedForm.type || form.type}
                    onChange={(e) =>
                      setEditedForm({ ...editedForm, type: e.target.value })
                    }
                    className="px-3 py-1.5 bg-white border border-[#d4cec4] rounded-lg text-sm focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none"
                  >
                    <option value="HYALURONIC">Kwas hialuronowy</option>
                    <option value="PMU">Makijaż permanentny</option>
                    <option value="LASER">Laser</option>
                  </select>
                ) : (
                  <span className="px-3 py-1 bg-[#8b7355]/10 text-[#8b7355] rounded-lg text-sm font-medium">
                    {formTypeLabels[form.type] || form.type}
                  </span>
                )}
                {form.clientId && (
                  <Link
                    href={`/admin/klientki/${form.clientId}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8b7355]/10 text-[#8b7355] hover:bg-[#8b7355]/20 rounded-lg text-sm font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profil klientki
                  </Link>
                )}
              </div>
              <p className="text-[#8b8580] mt-1">
                Formularz wypełniony: {formatDate(form.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-[#5a5550]">
              <Phone className="w-5 h-5 text-[#8b7355] flex-shrink-0" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedForm.telefon || ""}
                  onChange={(e) =>
                    setEditedForm({ ...editedForm, telefon: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 bg-white border border-[#d4cec4] rounded-lg text-sm focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none"
                  placeholder="Telefon"
                />
              ) : (
                <span>+48 {form.telefon}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[#5a5550]">
              <Mail className="w-5 h-5 text-[#8b7355] flex-shrink-0" />
              {isEditing ? (
                <input
                  type="email"
                  value={editedForm.email || ""}
                  onChange={(e) =>
                    setEditedForm({ ...editedForm, email: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 bg-white border border-[#d4cec4] rounded-lg text-sm focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none"
                  placeholder="Email"
                />
              ) : (
                <span>{form.email || "Brak email"}</span>
              )}
            </div>
            <div className="flex items-start gap-3 text-[#5a5550]">
              <MapPin className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-1" />
              {isEditing ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editedForm.ulica || ""}
                    onChange={(e) =>
                      setEditedForm({ ...editedForm, ulica: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-[#d4cec4] rounded-lg text-sm focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none"
                    placeholder="Ulica"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editedForm.kodPocztowy || ""}
                      onChange={(e) =>
                        setEditedForm({
                          ...editedForm,
                          kodPocztowy: e.target.value,
                        })
                      }
                      className="w-24 px-3 py-1.5 bg-white border border-[#d4cec4] rounded-lg text-sm focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none"
                      placeholder="Kod"
                    />
                    <input
                      type="text"
                      value={editedForm.miasto || ""}
                      onChange={(e) =>
                        setEditedForm({ ...editedForm, miasto: e.target.value })
                      }
                      className="flex-1 px-3 py-1.5 bg-white border border-[#d4cec4] rounded-lg text-sm focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none"
                      placeholder="Miasto"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {form.ulica || form.miasto ? (
                    <>
                      <span>{form.ulica}</span>
                      <span>
                        {form.kodPocztowy} {form.miasto}
                      </span>
                    </>
                  ) : (
                    <span>Brak adresu</span>
                  )}
                </div>
              )}
            </div>
            {form.dataUrodzenia && (
              <div className="flex items-center gap-3 text-[#5a5550]">
                <Calendar className="w-5 h-5 text-[#8b7355]" />
                <span>{form.dataUrodzenia}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 border-b border-[#d4cec4] overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "details"
                ? "text-[#8b7355] border-b-2 border-[#8b7355]"
                : "text-[#8b8580] hover:text-[#4a4540]"
            }`}
          >
            Szczegóły zabiegu
          </button>
          <button
            onClick={() => setActiveTab("contraindications")}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "contraindications"
                ? "text-[#8b7355] border-b-2 border-[#8b7355]"
                : "text-[#8b8580] hover:text-[#4a4540]"
            }`}
          >
            Przeciwwskazania
          </button>
          <button
            onClick={() => setActiveTab("consents")}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "consents"
                ? "text-[#8b7355] border-b-2 border-[#8b7355]"
                : "text-[#8b8580] hover:text-[#4a4540]"
            }`}
          >
            Zgody i Podpisy
          </button>
        </div>

        {/* Tab Content: Details */}
        {activeTab === "details" && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-serif text-[#4a4540] mb-4 pb-3 border-b border-[#d4cec4]">
              Szczegóły zabiegu
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8b8580] mb-1">
                  Preparat
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedForm.nazwaProduktu || ""}
                    onChange={(e) =>
                      setEditedForm({
                        ...editedForm,
                        nazwaProduktu: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d4cec4] rounded-lg focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none"
                    placeholder="Nazwa preparatu"
                  />
                ) : (
                  <p className="text-[#5a5550]">
                    {cleanNazwaProduktu(form.nazwaProduktu) || "Nie podano"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8b8580] mb-1">
                  Obszar zabiegu
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedForm.obszarZabiegu || ""}
                    onChange={(e) =>
                      setEditedForm({
                        ...editedForm,
                        obszarZabiegu: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d4cec4] rounded-lg focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none"
                    placeholder="Obszar zabiegu"
                  />
                ) : (
                  <p className="text-[#5a5550]">
                    {form.obszarZabiegu || "Nie podano"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8b8580] mb-1">
                  Cel / efekt
                </label>
                {isEditing ? (
                  <textarea
                    value={editedForm.celEfektu || ""}
                    onChange={(e) =>
                      setEditedForm({
                        ...editedForm,
                        celEfektu: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#d4cec4] rounded-lg focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none resize-none h-20"
                    placeholder="Cel zabiegu"
                  />
                ) : (
                  <p className="text-[#5a5550]">
                    {form.celEfektu || "Nie podano"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8b8580] mb-1">
                  Uwagi Dodatkowe
                </label>
                <div className="bg-[#f8f6f3] p-3 rounded-lg border border-[#d4cec4] min-h-[60px]">
                  <p className="text-[#5a5550] text-sm">
                    {form.informacjaDodatkowa || "Brak uwag"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Contraindications */}
        {activeTab === "contraindications" && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-serif text-[#4a4540] mb-4 pb-3 border-b border-[#d4cec4]">
              Przeciwwskazania
            </h2>
            <div className="space-y-2">
              {Object.entries(form.przeciwwskazania).map(([key, value]) => {
                const labels =
                  contraindicationsByFormType[form.type as FormType] ||
                  contraindicationsByFormType["HYALURONIC"];
                const label = labels[key] || key;
                const currentValue =
                  editedForm.przeciwwskazania?.[key] ?? value;

                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 py-2 border-b border-[#f0ebe4] last:border-0"
                  >
                    {isEditing ? (
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setEditedForm({
                              ...editedForm,
                              przeciwwskazania: {
                                ...editedForm.przeciwwskazania,
                                [key]: true,
                              },
                            })
                          }
                          className={`min-w-[40px] text-center px-2 py-1 text-xs rounded font-medium transition-colors ${
                            currentValue === true
                              ? "bg-red-500 text-white"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}
                        >
                          TAK
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditedForm({
                              ...editedForm,
                              przeciwwskazania: {
                                ...editedForm.przeciwwskazania,
                                [key]: false,
                              },
                            })
                          }
                          className={`min-w-[40px] text-center px-2 py-1 text-xs rounded font-medium transition-colors ${
                            currentValue === false
                              ? "bg-green-500 text-white"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                        >
                          NIE
                        </button>
                      </div>
                    ) : (
                      <>
                        {value === true ? (
                          <span className="min-w-[44px] text-center px-2 py-1 bg-red-100 text-red-600 text-xs rounded font-medium flex-shrink-0">
                            TAK
                          </span>
                        ) : value === false ? (
                          <span className="min-w-[44px] text-center px-2 py-1 bg-green-100 text-green-600 text-xs rounded font-medium flex-shrink-0">
                            NIE
                          </span>
                        ) : (
                          <span className="min-w-[44px] text-center px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded font-medium flex-shrink-0">
                            -
                          </span>
                        )}
                      </>
                    )}
                    <span className="text-sm text-[#5a5550]">
                      {typeof label === "string" ? label : label.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content: Consents & Signatures (New Card Style) */}
        {activeTab === "consents" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* RODO / Główne */}
            <div className="bg-white/80 rounded-2xl shadow-sm border border-[#d4cec4] p-6">
              <div className="flex justify-between items-center mb-4 border-b border-[#f0ebe4] pb-2">
                Zgoda RODO
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${form.podpisRodo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {form.podpisRodo ? "PODPISANO" : "BRAK ZGODY/PODPISU"}
                </span>
              </div>
              <div className="flex items-start gap-4 mb-4">
                {form.zgodaPrzetwarzanieDanych ? (
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-red-500 mt-0.5" />
                )}
                <p className="text-sm text-[#5a5550]">
                  Potwierdzenie: Świadoma zgoda na zabieg oraz przetwarzanie
                  danych w celach realizacji usługi.
                </p>
              </div>

              {form.podpisRodo ? (
                <div className="p-4 rounded-xl">
                  <p className="text-xs text-[#8b8580] uppercase tracking-wider mb-2 font-medium">
                    Podpis RODO
                  </p>
                  <img
                    src={form.podpisRodo}
                    alt="Podpis RODO"
                    className="h-40 object-contain mx-auto md:mx-0 filter mix-blend-multiply"
                  />
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-500 text-sm">
                  Brak podpisu głównego.
                </div>
              )}
            </div>

            {/* Marketing */}
            <div className="bg-white/80 rounded-2xl shadow-sm border border-[#d4cec4] p-6">
              <div className="flex justify-between items-center mb-4 border-b border-[#f0ebe4] pb-2">
                <h3 className="text-lg font-serif text-[#4a4540]">
                  Zgoda Marketingowa
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${form.zgodaMarketing ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {form.zgodaMarketing ? "WYRAŻONO ZGODĘ" : "BRAK ZGODY"}
                </span>
              </div>
              <p className="text-sm text-[#5a5550] mb-4">
                Zgoda na otrzymywanie informacji o nowościach i promocjach
                (SMS/Email).
              </p>
              {form.zgodaMarketing && form.podpisMarketing ? (
                <div className="bg-[#f8f6f3] p-4 rounded-xl border border-[#e5e0d8]">
                  <p className="text-xs text-[#8b8580] uppercase tracking-wider mb-2">
                    Podpis Marketingowy
                  </p>
                  <img
                    src={form.podpisMarketing}
                    alt="Podpis Marketing"
                    className="h-20 object-contain mx-auto md:mx-0"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Klient nie wyraził zgody.
                </p>
              )}
            </div>

            {/* Wizerunek */}
            <div className="bg-white/80 rounded-2xl shadow-sm border border-[#d4cec4] p-6">
              <div className="flex justify-between items-center mb-4 border-b border-[#f0ebe4] pb-2">
                <h3 className="text-lg font-serif text-[#4a4540]">
                  Zgoda na Wizerunek
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${form.zgodaFotografie ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {form.zgodaFotografie ? "WYRAŻONO ZGODĘ" : "BRAK ZGODY"}
                </span>
              </div>
              <p className="text-sm text-[#5a5550] mb-2">
                Zgoda na publikację zdjęć/wideo z zabiegu.
              </p>
              {form.miejscaPublikacjiFotografii && (
                <p className="text-sm text-[#4a4540] mb-4 font-medium">
                  Ograniczenia publikacji:{" "}
                  <span className="text-[#8b7355]">
                    {form.miejscaPublikacjiFotografii}
                  </span>
                </p>
              )}
              {form.zgodaFotografie && form.podpisFotografie ? (
                <div className="bg-[#f8f6f3] p-4 rounded-xl border border-[#e5e0d8]">
                  <p className="text-xs text-[#8b8580] uppercase tracking-wider mb-2">
                    Podpis Wizerunek
                  </p>
                  <img
                    src={form.podpisFotografie}
                    alt="Podpis Foto"
                    className="h-20 object-contain mx-auto md:mx-0"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Klient nie wyraził zgody.
                </p>
              )}
            </div>

            {/* Zgoda na Zabieg (dawniej Pomoc Prawna) */}
            <div className="bg-white/80 rounded-2xl shadow-sm border border-[#d4cec4] p-6">
              <div className="flex justify-between items-center mb-4 border-b border-[#f0ebe4] pb-2">
                <h3 className="text-lg font-serif text-[#4a4540]">
                  Zgoda na Zabieg
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${form.zgodaPomocPrawna ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {form.zgodaPomocPrawna ? "WYRAŻONO ZGODĘ" : "BRAK ZGODY"}
                </span>
              </div>
              <p className="text-sm text-[#5a5550] mb-4">
                Potwierdzenie: Świadoma zgoda na przeprowadzenie zabiegu po
                zapoznaniu się z informacjami i ryzykiem.
              </p>
              {form.zgodaPomocPrawna && form.podpisDane ? (
                <div className="p-4 rounded-xl">
                  <p className="text-xs text-[#8b8580] uppercase tracking-wider mb-2 font-medium">
                    Podpis Klienta
                  </p>
                  <img
                    src={form.podpisDane}
                    alt="Podpis Zabieg"
                    className="h-40 object-contain mx-auto md:mx-0 filter mix-blend-multiply"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Klient nie wyraził zgody.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
