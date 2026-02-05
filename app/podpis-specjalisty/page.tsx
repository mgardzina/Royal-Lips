"use client";

import { useState } from "react";
import SignaturePad from "@/components/SignaturePad";

export default function SpecialistSignaturePage() {
  const [signature, setSignature] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f9f5f0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-serif text-[#4a4540] mb-6 text-center">
          Generator Podpisu Specjalisty
        </h1>
        <p className="text-[#6b6560] mb-8 text-center">
          Proszę złożyć podpis poniżej. Po zatwierdzeniu pojawi się kod, który
          należy skopiować i przesłać programiście.
        </p>

        <div className="mb-8 border border-[#e5e0d8] rounded-xl overflow-hidden">
          <SignaturePad
            label="Podpis Specjalisty (Joanna Wielgos)"
            value={signature}
            onChange={setSignature}
            date={new Date().toLocaleDateString("pl-PL")}
          />
        </div>

        {signature && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-medium text-[#4a4540]">Twój kod podpisu:</h3>
            <textarea
              readOnly
              value={signature}
              className="w-full h-32 p-4 bg-[#f8f6f3] border border-[#d4cec4] rounded-lg font-mono text-xs text-[#5a5550] resize-none focus:outline-none focus:border-[#8b7355]"
            />
            <button
              onClick={handleCopy}
              className="w-full py-4 bg-[#8b7355] text-white rounded-xl font-medium hover:bg-[#7a6548] transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              {copied ? "Skopiowano do schowka!" : "Kopiuj kod podpisu"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
