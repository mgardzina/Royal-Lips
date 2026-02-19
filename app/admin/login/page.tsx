"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Błąd wysyłania kodu");
      }

      setStep("OTP");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        phone,
        code,
        redirect: false,
      });

      if (result?.error) {
        setError("Nieprawidłowy kod weryfikacyjny");
        setIsLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Wystąpił błąd podczas logowania");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f3] via-[#efe9e1] to-[#e8e0d5] flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#4a4540] mb-2">
            ROYAL LIPS
          </h1>
          <p className="text-[#8b7355]">Panel administracyjny</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {step === "PHONE" ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                Numer telefonu
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                placeholder="+48 123 456 789"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8b7355] text-white py-4 rounded-xl text-lg font-medium hover:bg-[#7a6548] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? "Wysyłanie..." : "Wyślij kod SMS"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-[#6b6560] mb-2 font-medium">
                Kod weryfikacyjny (SMS)
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 text-center text-2xl tracking-widest py-3 bg-white border border-[#d4cec4] rounded-xl focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355]/20 outline-none transition-all"
                placeholder="123456"
                maxLength={6}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("PHONE")}
                className="flex-1 bg-white border border-[#d4cec4] text-[#6b6560] py-4 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Wróć
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-[2] bg-[#8b7355] text-white py-4 rounded-xl text-lg font-medium hover:bg-[#7a6548] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? "Weryfikacja..." : "Zaloguj się"}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-[#8b8580] mt-8">
          <a href="/" className="hover:text-[#8b7355] transition-colors">
            &larr; Powrót do strony głównej
          </a>
        </p>
      </div>
    </div>
  );
}
