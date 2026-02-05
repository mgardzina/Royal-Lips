import React from "react";

interface SpecialistSignatureProps {
  date?: string;
}

export default function SpecialistSignature({
  date,
}: SpecialistSignatureProps) {
  return (
    <div className="bg-[#f8f6f3] p-6 rounded-xl border border-[#d4cec4]/50 mt-8 animate-in fade-in slide-in-from-bottom-2">
      <h3 className="text-xl font-serif text-[#4a4540] mb-4 border-b border-[#d4cec4] pb-2">
        Oświadczenie Specjalisty wykonującego zabieg
      </h3>
      <p className="text-sm text-[#5a5550] mb-6 leading-relaxed italic">
        "Oświadczam, że przeprowadziłem/am szczegółowy wywiad z Klientką/em,
        wykluczyłem/am przeciwwskazania, wyjaśniłem/am przebieg zabiegu oraz
        poinformowałem/am o ryzyku i zaleceniach pozabiegowych."
      </p>

      <div className="space-y-4">
        <label className="block text-sm text-[#6b6560] font-medium uppercase tracking-wide">
          Podpis Specjalisty
        </label>

        <div className="relative group max-w-sm">
          <div className="rounded-xl overflow-hidden border border-[#d4cec4] bg-white">
            <div
              style={{ height: "160px", width: "100%" }}
              className="flex items-center justify-center p-2"
            >
              <img
                src="/signature.png"
                alt="Podpis: Joanna Wielgos"
                className="max-h-full max-w-full object-contain filter mix-blend-multiply contrast-125 hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="absolute bottom-2 right-2">
            <span className="text-xs bg-white/80 px-2 py-1 rounded shadow-sm text-[#8b7355] border border-[#e5e0d8]">
              Zatwierdzono cyfrowo
            </span>
          </div>
        </div>

        {date && (
          <p className="text-xs text-[#6b6560] font-serif italic text-right max-w-sm">
            {date}
          </p>
        )}
      </div>
    </div>
  );
}
