"use client";

import { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  label: string;
  value: string;
  onChange: (signature: string) => void;
  required?: boolean;
  date?: string;
}

export default function SignaturePad({
  label,
  value,
  onChange,
  required,
  date,
}: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (value && sigCanvas.current) {
      sigCanvas.current.fromDataURL(value);
    }
  }, []);

  const handleClear = () => {
    sigCanvas.current?.clear();
    onChange("");
  };

  const handleEnd = () => {
    if (sigCanvas.current) {
      const dataUrl = sigCanvas.current.toDataURL("image/png");
      onChange(dataUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="block text-sm text-[#6b6560] font-medium uppercase tracking-wide">
          {label} {required && "*"}
        </label>
        {date && (
          <p className="text-xs text-[#6b6560] font-serif italic">{date}</p>
        )}
      </div>

      <div className="relative group">
        <div className="rounded-xl overflow-hidden bg-[#faf9f6]">
          <div style={{ height: "160px", width: "100%" }}>
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                className: "w-full h-full touch-none block",
              }}
              backgroundColor="transparent"
              penColor="black"
              minWidth={1.0}
              maxWidth={2.5} // Optimized for Apple Pencil / Real pen feel
              onEnd={handleEnd}
            />
          </div>
        </div>

        {/* Helper text / Clear button inside/below */}
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs bg-white/80 px-2 py-1 rounded shadow-sm text-[#8b7355] hover:text-[#6b5540] transition-colors"
          >
            Wyczyść
          </button>
        </div>

        {/* Placeholder text if empty? No, standard line is better. */}
        {!value && (
          <div className="absolute bottom-4 left-4 pointer-events-none select-none">
            <span className="text-[#d4cec4] text-xs uppercase tracking-widest border-t border-[#d4cec4] pt-1">
              Podpisz tutaj
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
