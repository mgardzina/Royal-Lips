"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, FileText, Check, X, Search } from "lucide-react";

const formTypeLabels: Record<string, string> = {
  LIP_AUGMENTATION: "Modelowanie ust",
  FACIAL_VOLUMETRY: "Wolumetria twarzy",
  WRINKLE_REDUCTION: "Niwelowanie zmarszczek",
  NEEDLE_MESOTHERAPY: "Mezoterapia igłowa",
  INJECTION_LIPOLYSIS: "Lipoliza iniekcyjna",
  PERMANENT_MAKEUP: "Makijaż permanentny",
  TISSUE_STIMULATION: "Stymulacja tkankowa",
  LASER_HAIR_REMOVAL: "Depilacja laserowa",
  LASER_TATTOO_REMOVAL: "Usuwanie tatuażu",
  EYELID_LIFT: "Lifting powiek",
  EYEBROW_TINTING: "Henna brwi",
  EYELASH_EXTENSION: "Przedłużanie rzęs",
  EYEBROW_LAMINATION: "Laminacja brwi",
};

const formTypeBadge = (type: string): { label: string; colors: string } => {
  const map: Record<string, { label: string; colors: string }> = {
    LIP_AUGMENTATION: {
      label: "Modelowanie ust",
      colors: "bg-pink-100 text-pink-700",
    },
    FACIAL_VOLUMETRY: {
      label: "Wolumetria twarzy",
      colors: "bg-rose-100 text-rose-700",
    },
    WRINKLE_REDUCTION: {
      label: "Zmarszczki",
      colors: "bg-orange-100 text-orange-700",
    },
    NEEDLE_MESOTHERAPY: {
      label: "Mezoterapia igłowa",
      colors: "bg-amber-100 text-amber-700",
    },
    INJECTION_LIPOLYSIS: {
      label: "Lipoliza iniekcyjna",
      colors: "bg-yellow-100 text-yellow-700",
    },
    TISSUE_STIMULATION: {
      label: "Stymulacja tkankowa",
      colors: "bg-lime-100 text-lime-700",
    },
    PERMANENT_MAKEUP: {
      label: "Makijaż permanentny",
      colors: "bg-purple-100 text-purple-700",
    },
    LASER_HAIR_REMOVAL: {
      label: "Depilacja laserowa",
      colors: "bg-red-100 text-red-700",
    },
    LASER_TATTOO_REMOVAL: {
      label: "Usuwanie tatuażu",
      colors: "bg-red-200 text-red-800",
    },
    EYELID_LIFT: {
      label: "Lifting powiek",
      colors: "bg-teal-100 text-teal-700",
    },
    EYEBROW_TINTING: {
      label: "Henna brwi",
      colors: "bg-cyan-100 text-cyan-700",
    },
    EYELASH_EXTENSION: {
      label: "Przedłużanie rzęs",
      colors: "bg-sky-100 text-sky-700",
    },
    EYEBROW_LAMINATION: {
      label: "Laminacja brwi",
      colors: "bg-blue-100 text-blue-700",
    },
  };
  return (
    map[type] || {
      label: formTypeLabels[type] || type,
      colors: "bg-gray-100 text-gray-700",
    }
  );
};

interface ConsentFormSummary {
  id: string;
  type: string;
  createdAt: string;
  imieNazwisko: string;
  telefon: string;
  miejscowoscData: string;
  zgodaPrzetwarzanieDanych: boolean;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [forms, setForms] = useState<ConsentFormSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Sprawdzenie autentykacji
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchForms();
    }
  }, [status]);

  const fetchForms = async () => {
    try {
      const response = await fetch("/api/consent-forms");
      const data = await response.json();
      if (data.success) {
        setForms(data.forms);
      }
    } catch (error) {
      console.error("Błąd pobierania formularzy:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredForms = forms.filter(
    (form) =>
      form.imieNazwisko.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.telefon.includes(searchQuery),
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pokaż loading gdy sesja jest sprawdzana
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5] flex items-center justify-center">
        <div className="text-[#8b7355] text-lg">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5]">
      {/* Header */}
      <header className="bg-[#4a4540]/95 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif text-white tracking-wider">
              ROYAL LIPS
            </h1>
            <p className="text-white/60 text-sm">
              {session?.user?.email === "admin@royal-lips.pl"
                ? "Panel administracyjny"
                : session?.user?.name || "Panel"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/klientki"
              className="text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Baza Klientek
            </Link>
            <Link
              href="/admin/statystyki"
              className="text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Statystyki
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Wyloguj</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8580]" />
            <input
              type="text"
              placeholder="Szukaj po nazwisku lub telefonie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b border-[#d4cec4]">
            <h2 className="text-xl font-serif text-[#4a4540] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#8b7355]" />
              Formularze zgód
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-[#8b8580]">Ładowanie...</div>
          ) : filteredForms.length === 0 ? (
            <div className="p-12 text-center text-[#8b8580]">
              {searchQuery
                ? "Brak wyników dla podanego wyszukiwania"
                : "Brak formularzy"}
            </div>
          ) : (
            <div className="divide-y divide-[#d4cec4]">
              {filteredForms.map((form) => (
                <Link
                  key={form.id}
                  href={`/admin/formularz/${form.id}`}
                  className="block p-4 md:p-6 hover:bg-white/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-[#4a4540] flex items-center gap-2">
                        {form.imieNazwisko}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${formTypeBadge(form.type).colors}`}
                        >
                          {formTypeBadge(form.type).label}
                        </span>
                      </h3>
                      <p className="text-sm text-[#8b8580]">
                        +48 {form.telefon} &bull; {form.miejscowoscData}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex items-center gap-1 text-xs"
                          title="Zgoda na dane"
                        >
                          {form.zgodaPrzetwarzanieDanych ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                          RODO
                        </span>
                      </div>
                      <span className="text-sm text-[#8b8580]">
                        {formatDate(form.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
