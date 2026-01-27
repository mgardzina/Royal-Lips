"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Phone,
  StickyNote,
  FileText,
} from "lucide-react";

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface Form {
  id: string;
  createdAt: string;
  obszarZabiegu: string | null;
  nazwaProduktu: string | null;
  telefon: string;
}

interface ClientDetails {
  id: string;
  imieNazwisko: string;
  telefon: string | null;
  forms: Form[];
  notes: Note[];
}

export default function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [clientId, setClientId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setClientId(p.id));
  }, [params]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && clientId) {
      fetchClientDetails();
    }
  }, [status, clientId]);

  const fetchClientDetails = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      const data = await response.json();
      if (data.success) {
        setClient(data.client);
      }
    } catch (error) {
      console.error("Błąd pobierania danych klientki:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });
      const data = await response.json();
      if (data.success) {
        setNewNote("");
        fetchClientDetails(); // Odśwież dane
      }
    } catch (error) {
      console.error("Błąd dodawania notatki:", error);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tę notatkę?")) return;

    try {
      const response = await fetch(`/api/clients/${clientId}/notes/${noteId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        fetchClientDetails(); // Odśwież dane
      }
    } catch (error) {
      console.error("Błąd usuwania notatki:", error);
    }
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

  if (status === "loading" || status === "unauthenticated" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5] flex items-center justify-center">
        <div className="text-[#8b7355] text-lg">Ładowanie...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5] p-8 text-center">
        Klientka nie znaleziona
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
              href="/admin/klientki"
              className="text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-serif text-white tracking-wider">
                {client.imieNazwisko}
              </h1>
              <p className="text-white/60 text-sm flex items-center gap-2">
                <Phone className="w-3 h-3" />
                {client.telefon ? `+48 ${client.telefon}` : "Brak telefonu"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lewa kolumna - Notatki */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-serif text-[#4a4540] flex items-center gap-2 mb-4">
              <StickyNote className="w-5 h-5 text-[#8b7355]" />
              Notatki
            </h2>

            <form onSubmit={handleAddNote} className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Dodaj notatkę (np. alergie, preferencje)..."
                className="w-full p-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all resize-none h-24 text-sm"
              />
              <button
                type="submit"
                disabled={isSubmittingNote || !newNote.trim()}
                className="mt-2 w-full bg-[#8b7355] text-white py-2 rounded-lg hover:bg-[#6d5a43] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Dodaj notatkę
              </button>
            </form>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {client.notes.length === 0 ? (
                <p className="text-sm text-[#8b8580] text-center">
                  Brak notatek
                </p>
              ) : (
                client.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white p-4 rounded-xl border border-[#d4cec4] relative group"
                  >
                    <p className="text-[#4a4540] text-sm whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <div className="mt-2 flex justify-between items-center text-xs text-[#8b8580]">
                      <span>{formatDate(note.createdAt)}</span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1"
                        title="Usuń notatkę"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Prawa kolumna - Historia zabiegów */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-[#d4cec4]">
              <h2 className="text-xl font-serif text-[#4a4540] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#8b7355]" />
                Historia zabiegów ({client.forms.length})
              </h2>
            </div>

            <div className="divide-y divide-[#d4cec4]">
              {client.forms.length === 0 ? (
                <div className="p-12 text-center text-[#8b8580]">
                  Brak historii zabiegów
                </div>
              ) : (
                client.forms.map((form) => (
                  <Link
                    key={form.id}
                    href={`/admin/formularz/${form.id}`}
                    className="block p-6 hover:bg-white/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-[#4a4540]">
                          {form.nazwaProduktu || "Zabieg bez nazwy"}
                        </h3>
                        <p className="text-sm text-[#8b8580]">
                          {form.obszarZabiegu || "Brak obszaru"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#8b8580]">
                        <Calendar className="w-4 h-4" />
                        {formatDate(form.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
