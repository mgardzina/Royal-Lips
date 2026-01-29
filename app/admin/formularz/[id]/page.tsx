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
  miejscaPublikacjiFotografii: string | null;
  podpisDane: string | null;
  podpisMarketing: string | null;
  podpisFotografie: string | null;
  podpisRodo: string | null;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedForm, setEditedForm] = useState<Partial<ConsentFormFull>>({});

  useEffect(() => {
    fetchForm();
  }, [params.id]);

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/consent-forms/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setForm(data.form);
        setEditedForm(data.form);
      }
    } catch (error) {
      console.error("Błąd pobierania formularza:", error);
    } finally {
      setIsLoading(false);
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
    setEditedForm(form || {});
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
        {/* Header Info */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
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

        {/* Procedure Details */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
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
                    setEditedForm({ ...editedForm, celEfektu: e.target.value })
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
          </div>
        </div>

        {/* Contraindications */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-serif text-[#4a4540] mb-4 pb-3 border-b border-[#d4cec4]">
            Przeciwwskazania
          </h2>
          <div className="space-y-2">
            {Object.entries(form.przeciwwskazania).map(([key, value]) => {
              const labels =
                contraindicationsByFormType[form.type as FormType] ||
                contraindicationsByFormType["HYALURONIC"];
              const label = labels[key] || key;
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 py-2 border-b border-[#f0ebe4] last:border-0"
                >
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
                  <span className="text-sm text-[#5a5550]">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consents */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-serif text-[#4a4540] mb-4 pb-3 border-b border-[#d4cec4]">
            Zgody
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {form.zgodaPrzetwarzanieDanych ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
              <span className="text-[#5a5550]">
                Zgoda na przetwarzanie danych
              </span>
            </div>
            <div className="flex items-center gap-3">
              {form.zgodaMarketing ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
              <span className="text-[#5a5550]">Zgoda marketingowa</span>
            </div>
            <div className="flex items-center gap-3">
              {form.zgodaFotografie ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
              <span className="text-[#5a5550]">Zgoda na fotografie</span>
              {form.zgodaFotografie && form.miejscaPublikacjiFotografii && (
                <span className="text-sm text-[#8b8580]">
                  ({form.miejscaPublikacjiFotografii})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-serif text-[#4a4540] mb-4 pb-3 border-b border-[#d4cec4]">
            Podpisy
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {form.podpisDane && (
              <div>
                <p className="text-sm text-[#8b8580] mb-2">
                  Podpis - zgoda na dane
                </p>
                <div className="bg-white rounded-xl p-2 border border-[#d4cec4]">
                  <img
                    src={form.podpisDane}
                    alt="Podpis"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
            {form.podpisMarketing && (
              <div>
                <p className="text-sm text-[#8b8580] mb-2">
                  Podpis - zgoda marketing
                </p>
                <div className="bg-white rounded-xl p-2 border border-[#d4cec4]">
                  <img
                    src={form.podpisMarketing}
                    alt="Podpis"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
            {form.podpisFotografie && (
              <div>
                <p className="text-sm text-[#8b8580] mb-2">
                  Podpis - zgoda foto
                </p>
                <div className="bg-white rounded-xl p-2 border border-[#d4cec4]">
                  <img
                    src={form.podpisFotografie}
                    alt="Podpis"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
            {form.podpisRodo && (
              <div>
                <p className="text-sm text-[#8b8580] mb-2">Podpis - RODO</p>
                <div className="bg-white rounded-xl p-2 border border-[#d4cec4]">
                  <img
                    src={form.podpisRodo}
                    alt="Podpis"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
