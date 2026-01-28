"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3, Camera, Megaphone, Shield } from "lucide-react";

interface StatsData {
  total: number;
  zgodaMarketing: number;
  zgodaFotografie: number;
  zgodaPrzetwarzanieDanych: number;
}

export default function StatystykiPage() {
  const { status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    zgodaMarketing: 0,
    zgodaFotografie: 0,
    zgodaPrzetwarzanieDanych: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/consent-forms");
      const data = await response.json();
      if (data.success) {
        const forms = data.forms;
        setStats({
          total: forms.length,
          zgodaMarketing: forms.filter(
            (f: { zgodaMarketing: boolean }) => f.zgodaMarketing
          ).length,
          zgodaFotografie: forms.filter(
            (f: { zgodaFotografie: boolean }) => f.zgodaFotografie
          ).length,
          zgodaPrzetwarzanieDanych: forms.filter(
            (f: { zgodaPrzetwarzanieDanych: boolean }) =>
              f.zgodaPrzetwarzanieDanych
          ).length,
        });
      }
    } catch (error) {
      console.error("Błąd pobierania statystyk:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePercentage = (value: number) => {
    if (stats.total === 0) return 0;
    return Math.round((value / stats.total) * 100);
  };

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
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-serif text-white tracking-wider">
                Statystyki
              </h1>
              <p className="text-white/60 text-sm">Zgody i RODO</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center text-[#8b8580]">Ładowanie...</div>
        ) : (
          <>
            {/* Główne statystyki */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Wszystkie formularze */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#8b7355]/10 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-[#8b7355]" />
                  </div>
                  <p className="text-[#8b7355] text-sm font-medium">
                    Wszystkie formularze
                  </p>
                </div>
                <p className="text-4xl font-serif text-[#4a4540]">
                  {stats.total}
                </p>
              </div>

              {/* Zgody RODO */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-[#8b7355] text-sm font-medium">
                    Zgody RODO (dane)
                  </p>
                </div>
                <p className="text-4xl font-serif text-[#4a4540]">
                  {stats.zgodaPrzetwarzanieDanych}
                </p>
                <p className="text-sm text-[#8b8580] mt-2">
                  {calculatePercentage(stats.zgodaPrzetwarzanieDanych)}% klientek
                </p>
              </div>

              {/* Zgody marketing */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Megaphone className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-[#8b7355] text-sm font-medium">
                    Zgody marketing
                  </p>
                </div>
                <p className="text-4xl font-serif text-[#4a4540]">
                  {stats.zgodaMarketing}
                </p>
                <p className="text-sm text-[#8b8580] mt-2">
                  {calculatePercentage(stats.zgodaMarketing)}% klientek
                </p>
              </div>

              {/* Zgody foto */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Camera className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-[#8b7355] text-sm font-medium">
                    Zgody foto
                  </p>
                </div>
                <p className="text-4xl font-serif text-[#4a4540]">
                  {stats.zgodaFotografie}
                </p>
                <p className="text-sm text-[#8b8580] mt-2">
                  {calculatePercentage(stats.zgodaFotografie)}% klientek
                </p>
              </div>
            </div>

            {/* Podsumowanie */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <h2 className="text-xl font-serif text-[#4a4540] mb-6 pb-3 border-b border-[#d4cec4]">
                Podsumowanie zgód
              </h2>
              <div className="space-y-6">
                {/* RODO */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#5a5550] font-medium">
                      Zgoda RODO (przetwarzanie danych)
                    </span>
                    <span className="text-[#8b7355] font-medium">
                      {stats.zgodaPrzetwarzanieDanych} / {stats.total}
                    </span>
                  </div>
                  <div className="h-3 bg-[#e8e0d5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${calculatePercentage(stats.zgodaPrzetwarzanieDanych)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Marketing */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#5a5550] font-medium">
                      Zgoda marketingowa
                    </span>
                    <span className="text-[#8b7355] font-medium">
                      {stats.zgodaMarketing} / {stats.total}
                    </span>
                  </div>
                  <div className="h-3 bg-[#e8e0d5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${calculatePercentage(stats.zgodaMarketing)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Foto */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#5a5550] font-medium">
                      Zgoda na fotografie
                    </span>
                    <span className="text-[#8b7355] font-medium">
                      {stats.zgodaFotografie} / {stats.total}
                    </span>
                  </div>
                  <div className="h-3 bg-[#e8e0d5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${calculatePercentage(stats.zgodaFotografie)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
