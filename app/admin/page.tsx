"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, FileText, Check, X, Search } from "lucide-react";

interface ConsentFormSummary {
  id: string;
  createdAt: string;
  imieNazwisko: string;
  telefon: string;
  miejscowoscData: string;
  zgodaPrzetwarzanieDanych: boolean;
  zgodaMarketing: boolean;
  zgodaFotografie: boolean;
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
            <p className="text-white/60 text-sm">Panel administracyjny</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Wyloguj</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <p className="text-[#8b7355] text-sm font-medium">
              Wszystkie formularze
            </p>
            <p className="text-4xl font-serif text-[#4a4540] mt-2">
              {forms.length}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <p className="text-[#8b7355] text-sm font-medium">
              Zgody marketing
            </p>
            <p className="text-4xl font-serif text-[#4a4540] mt-2">
              {forms.filter((f) => f.zgodaMarketing).length}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <p className="text-[#8b7355] text-sm font-medium">Zgody foto</p>
            <p className="text-4xl font-serif text-[#4a4540] mt-2">
              {forms.filter((f) => f.zgodaFotografie).length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
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
          <div className="p-6 border-b border-[#d4cec4]">
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
                  className="block p-6 hover:bg-white/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-[#4a4540]">
                        {form.imieNazwisko}
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
                          Dane
                        </span>
                        <span
                          className="flex items-center gap-1 text-xs"
                          title="Zgoda marketing"
                        >
                          {form.zgodaMarketing ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                          Marketing
                        </span>
                        <span
                          className="flex items-center gap-1 text-xs"
                          title="Zgoda foto"
                        >
                          {form.zgodaFotografie ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                          Foto
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
