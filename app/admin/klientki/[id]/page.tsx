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
  Mail,
  AlertTriangle,
  Heart,
  MessageSquare,
} from "lucide-react";

type NoteCategory = "NOTATKA" | "ALERGIA" | "UWAGA" | "PREFERENCJA";

interface Note {
  id: string;
  content: string;
  category: NoteCategory;
  createdAt: string;
}

interface Form {
  id: string;
  type: "HYALURONIC" | "PMU" | "LASER";
  createdAt: string;
  obszarZabiegu: string | null;
  email: string | null;
  telefon: string;
}

const categoryLabels: Record<Form["type"], string> = {
  HYALURONIC: "Kwas hialuronowy",
  PMU: "Makijaż permanentny",
  LASER: "Laser",
};

const noteCategoryConfig: Record<
  NoteCategory,
  { label: string; color: string; bgColor: string; icon: typeof StickyNote }
> = {
  NOTATKA: {
    label: "Notatka",
    color: "text-gray-600",
    bgColor: "bg-gray-50 border-gray-200",
    icon: MessageSquare,
  },
  ALERGIA: {
    label: "Alergia",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
    icon: AlertTriangle,
  },
  UWAGA: {
    label: "Uwaga",
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
    icon: AlertTriangle,
  },
  PREFERENCJA: {
    label: "Preferencja",
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
    icon: Heart,
  },
};

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
  const [newNoteCategory, setNewNoteCategory] =
    useState<NoteCategory>("NOTATKA");
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
        body: JSON.stringify({ content: newNote, category: newNoteCategory }),
      });
      const data = await response.json();
      if (data.success) {
        setNewNote("");
        setNewNoteCategory("NOTATKA");
        fetchClientDetails();
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
        fetchClientDetails();
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

  // Sortuj notatki: najpierw alergie i uwagi, potem reszta
  const sortedNotes = client?.notes
    ? [...client.notes].sort((a, b) => {
        const priority: Record<NoteCategory, number> = {
          ALERGIA: 0,
          UWAGA: 1,
          PREFERENCJA: 2,
          NOTATKA: 3,
        };
        return priority[a.category] - priority[b.category];
      })
    : [];

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
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {client.telefon ? `+48 ${client.telefon}` : "Brak telefonu"}
                </span>
                {client.forms.length > 0 && client.forms[0].email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {client.forms[0].email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lewa kolumna - Notatki */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6">
            <h2 className="text-xl font-serif text-[#4a4540] flex items-center gap-2 mb-4">
              <StickyNote className="w-5 h-5 text-[#8b7355]" />
              Notatki i adnotacje
            </h2>

            <form onSubmit={handleAddNote} className="mb-6">
              <div className="mb-3">
                <label className="block text-sm font-medium text-[#8b8580] mb-2">
                  Kategoria
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    Object.entries(noteCategoryConfig) as [
                      NoteCategory,
                      (typeof noteCategoryConfig)[NoteCategory],
                    ][]
                  ).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setNewNoteCategory(key)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                          newNoteCategory === key
                            ? `${config.bgColor} ${config.color} border-current`
                            : "bg-white border-[#d4cec4] text-[#8b8580] hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={
                  newNoteCategory === "ALERGIA"
                    ? "Opisz alergię lub przeciwwskazanie..."
                    : newNoteCategory === "UWAGA"
                      ? "Dodaj ważną uwagę..."
                      : newNoteCategory === "PREFERENCJA"
                        ? "Opisz preferencję klientki..."
                        : "Dodaj notatkę..."
                }
                className="w-full p-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all resize-none h-24 text-sm"
              />
              <button
                type="submit"
                disabled={isSubmittingNote || !newNote.trim()}
                className="mt-2 w-full bg-[#8b7355] text-white py-2 rounded-lg hover:bg-[#6d5a43] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Dodaj {noteCategoryConfig[newNoteCategory].label.toLowerCase()}
              </button>
            </form>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {sortedNotes.length === 0 ? (
                <p className="text-sm text-[#8b8580] text-center py-4">
                  Brak notatek
                </p>
              ) : (
                sortedNotes.map((note) => {
                  const config =
                    noteCategoryConfig[note.category] ||
                    noteCategoryConfig.NOTATKA;
                  const Icon = config.icon;
                  return (
                    <div
                      key={note.id}
                      className={`p-4 rounded-xl border relative group ${config.bgColor}`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Icon className={`w-4 h-4 mt-0.5 ${config.color}`} />
                        <span className={`text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-[#4a4540] text-sm whitespace-pre-wrap pl-6">
                        {note.content}
                      </p>
                      <div className="mt-2 flex justify-between items-center text-xs text-[#8b8580] pl-6">
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
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Prawa kolumna - Historia zabiegów */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 md:p-6 border-b border-[#d4cec4]">
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
                    className="block p-4 md:p-6 hover:bg-white/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-[#4a4540]">
                          {categoryLabels[form.type]}
                        </h3>
                        <p className="text-sm text-[#8b8580]">
                          {form.obszarZabiegu || "Brak szczegółów"}
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
