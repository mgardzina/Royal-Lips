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
    <div className="space-y-2">
      <label className="block text-sm text-[#6b6560] font-medium">
        {label} {required && "*"}
      </label>
      <div className="border border-[#d4cec4] rounded-xl overflow-hidden bg-white">
        <div style={{ height: "112px", width: "100%" }}>
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: "w-full h-full touch-none block",
            }}
            backgroundColor="rgb(255, 255, 255)"
            penColor="#6b6560"
            minWidth={0.5}
            maxWidth={1.5}
            onEnd={handleEnd}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <p className="text-xs text-[#8b8580]">Podpisz myszką lub palcem</p>
          {date && (
            <p className="text-xs text-[#6b6560]">
              Data: <span className="font-medium">{date}</span>
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-[#8b7355] hover:text-[#6b5540] transition-colors"
        >
          Wyczyść
        </button>
      </div>
    </div>
  );
}
